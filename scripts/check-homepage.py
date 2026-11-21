#!/usr/bin/env python3
"""Check rendered content, assets, internal links, metadata, and Jekyll integration."""
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.resources = []
        self.links = []
        self.stack = []
        self.schema = []
        self.in_schema = False
        self.papers = []
        self.rows = 0
        self.h1_count = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag not in VOID:
            self.stack.append(tag)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag in ("script", "img") and attrs.get("src"):
            self.resources.append(attrs["src"])
        if tag == "link" and attrs.get("rel") in ("stylesheet", "icon"):
            self.resources.append(attrs["href"])
        if tag == "img":
            assert attrs.get("alt"), f"Missing image description: {attrs}"
            assert attrs.get("width") and attrs.get("height"), "Reserve image dimensions to avoid layout shifts."
        if tag == "a":
            self.links.append(attrs.get("href", ""))
            if attrs.get("target") == "_blank":
                assert "noopener" in attrs.get("rel", ""), "External tabs require noopener."
        if tag == "button":
            assert attrs.get("type") == "button", "Explicit button type required."
        if tag == "h1":
            self.h1_count += 1
        if tag == "article" and "data-paper" in attrs:
            self.papers.append(attrs["data-paper"])
        if tag == "article" and "publication-row" in attrs.get("class", "").split():
            self.rows += 1
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        assert self.stack and self.stack[-1] == tag, f"Unbalanced HTML: </{tag}> after {self.stack[-3:]}"
        self.stack.pop()
        if tag == "script":
            self.in_schema = False

    def handle_data(self, data):
        if self.in_schema:
            self.schema.append(data)


def main():
    in_jekyll = (ROOT / "_pages/about.md").exists()
    page_path = ROOT / "_layouts/yihao-home.html" if in_jekyll else ROOT / "index.html"
    html = page_path.read_text()
    page = Page()
    page.feed(html)
    assert not page.stack, f"Unclosed HTML tags: {page.stack}"
    assert page.h1_count == 1, "The homepage should have one main heading."
    duplicates = [key for key, count in Counter(page.ids).items() if count > 1]
    assert not duplicates, f"Duplicate IDs: {duplicates}"
    assert not re.search(r"@@[a-z_]+@@", html), "Template placeholders remain."
    for resource in page.resources:
        url = urlsplit(resource)
        if not url.scheme and not url.netloc:
            assert (ROOT / url.path.lstrip("/")).is_file(), f"Missing local resource: {resource}"
    for href in page.links:
        assert href and href != "#", "Empty link destination."
        if href.startswith("#"):
            assert href[1:] in page.ids, f"Missing internal destination: {href}"
        elif not urlsplit(href).scheme:
            if href == "classic.html" and in_jekyll:
                assert (ROOT / "_pages/classic-home.md").is_file()
            else:
                assert (ROOT / href).exists(), f"Missing local page: {href}"
    schema = json.loads("".join(page.schema))
    assert schema["@type"] == "Person" and schema["name"] == "Yihao Hu"
    profile = json.loads((ROOT / "content/profile.json").read_text())
    papers = profile["publications"]
    assert len(papers) == len({paper["id"] for paper in papers}), "Duplicate publication IDs."
    assert page.rows == len(papers), "Every publication must be prerendered."
    assert set(page.papers) == {paper["id"] for paper in papers if paper.get("selected")}
    for paper in papers:
        assert paper["paper"].startswith("https://"), f"Missing paper URL: {paper['id']}"
        if paper.get("image"):
            assert (ROOT / paper["image"]).is_file(), f"Missing publication image: {paper['id']}"
    for svg in (ROOT / "assets/homepage").rglob("*.svg"):
        ET.parse(svg)
    if in_jekyll:
        assert re.search(r"^layout:\s*yihao-home\s*$", (ROOT / "_pages/about.md").read_text(), re.M)
        assert not (ROOT / "index.html").exists(), "A standalone index.html would collide with Jekyll's homepage."
        assert not (ROOT / ".nojekyll").exists(), "Keep the existing Jekyll deployment."
        assert "permalink: /classic.html" in (ROOT / "_pages/classic-home.md").read_text()
    else:
        assert (ROOT / "_layouts/yihao-home.html").read_bytes() == page_path.read_bytes()
    print(f"PASS: complete HTML; {len(page.ids)} unique IDs; local assets and anchors; {len(page.papers)} selected cards; {page.rows} static publication rows; structured data; valid SVG; {'Jekyll' if in_jekyll else 'standalone'} integration.")
    print("Browser layout, animation, external URL availability, and GitHub deployment require separate verification.")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, OSError, ValueError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)

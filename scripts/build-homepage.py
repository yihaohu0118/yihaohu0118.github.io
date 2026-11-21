#!/usr/bin/env python3
"""Render a complete, crawlable homepage using only the Python standard library."""
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def esc(value):
    return escape(str(value), quote=True)


def authors(text):
    return esc(text).replace("Yihao Hu", "<strong>Yihao Hu</strong>")


def links(paper):
    return "".join(
        f'<a href="{esc(paper[key])}" target="_blank" rel="noopener noreferrer">{label}</a>'
        for key, label in [("paper", "Paper"), ("code", "Code"), ("project", "Project")]
        if paper.get(key)
    )


def paper_card(paper):
    note = "Research overview"
    return f'''<article class="paper-card" data-paper="{esc(paper['id'])}" data-category="{esc(paper['category'])}">
      <div class="paper-topline"><span class="venue">{esc(paper['venue'])}</span><span class="paper-category">{esc(paper['category'])}</span></div>
      <button class="paper-image" type="button" data-expand aria-label="Enlarge {esc(paper['short'])}">
        <img src="{esc(paper['image'])}" alt="{esc(paper['short'])}: {note.lower()}" width="720" height="440" loading="lazy" decoding="async">
        <span class="image-caption">{note}</span><span class="expand-label">Explore</span>
      </button>
      <div class="paper-body"><p class="paper-short">{esc(paper['short'])}</p>
        <h3><a href="{esc(paper['paper'])}" target="_blank" rel="noopener noreferrer">{esc(paper['title'])}</a></h3>
        <p class="paper-authors">{authors(paper['authors'])}</p>
        <p class="paper-description">{esc(paper['description'])}</p>
        <div class="paper-links">{links(paper)}</div>
      </div>
    </article>'''


def education_ticket(item):
    mark = f'<img src="{esc(item["logo"])}" alt="{esc(item["school"])} logo" width="100" height="80" loading="lazy" decoding="async">'
    detail = (f'<a href="{esc(item["url"])}" target="_blank" rel="noopener noreferrer">{esc(item["detail"])}</a>'
              if item.get("url") else esc(item["detail"]))
    return f'''<article class="ticket">
      <div class="ticket-main"><div class="institution-mark">{mark}</div>
        <div class="ticket-copy"><p class="ticket-role">{esc(item['degree'])} @</p><h3>{esc(item['school'])}</h3><p>{detail}</p></div>
      </div>
      <div class="ticket-stub"><span>{esc(item['date'])}</span><span class="stub-cut" aria-hidden="true"></span></div>
    </article>'''


def internship_ticket(item):
    mentor = f'<p class="ticket-mentor">Mentors: {esc(item["mentors"])}</p>' if item.get("mentors") else ""
    mark = f'<img src="{esc(item["logo"])}" alt="{esc(item["company"])} logo" width="110" height="80" loading="lazy" decoding="async">'
    return f'''<article class="ticket internship-ticket">
      <div class="ticket-main"><div class="institution-mark company-mark {esc(item['logo_class'])}">{mark}</div>
        <div class="ticket-copy"><p class="ticket-role">{esc(item['role'])} @</p><h3>{esc(item['company'])}</h3><p>{esc(item['detail'])}</p>{mentor}</div>
      </div><div class="ticket-stub"><span>{esc(item['date'])}</span><span class="stub-cut" aria-hidden="true"></span></div>
    </article>'''


def render():
    profile = json.loads((ROOT / "content/profile.json").read_text())
    template = (ROOT / "scripts/homepage.template.html").read_text()
    news = []
    for item in profile["news"]:
        extras = " ".join(f'<a href="{esc(link["url"])}" target="_blank" rel="noopener noreferrer">{esc(link["label"])}</a>' for link in item.get("links", []))
        date_value = item["date"].replace(".", "-")
        news.append(f'<li><time datetime="{esc(date_value)}">{esc(item["date"])}</time><div>{esc(item["text"])} <span class="news-links">{extras}</span></div></li>')
    publication_rows = []
    for paper in sorted(profile["publications"], key=lambda item: -item["year"]):
        publication_rows.append(f'''<article class="publication-row" data-category="{esc(paper['category'])}">
          <p class="row-venue">{esc(paper['venue'])}</p><div><h3><a href="{esc(paper['paper'])}" target="_blank" rel="noopener noreferrer">{esc(paper['title'])}</a></h3>
          <p class="row-authors">{authors(paper['authors'])}</p><div class="paper-links">{links(paper)}</div></div>
        </article>''')
    values = {
        "build_id": esc(profile.get("build_id", "local")),
        "name": esc(profile["name"]), "name_zh": esc(profile["name_zh"]),
        "avatar": esc(profile["avatar"]), "email": esc(profile["email"]),
        "scholar": esc(profile["scholar"]), "github": esc(profile["github"]),
        "interests": "".join(f'<span>{esc(interest)}</span>' for interest in profile["interests"]),
        "news": "\n".join(news),
        "education": "\n".join(education_ticket(item) for item in profile["education"]),
        "internships": "\n".join(internship_ticket(item) for item in profile["internships"]),
        "paper_cards": "\n".join(paper_card(paper) for paper in profile["publications"] if paper.get("selected")),
        "publication_rows": "\n".join(publication_rows),
        "publication_count": str(len(profile["publications"])),
        "classic_link": '<a href="classic.html">Classic version</a>' if (ROOT / "_pages/classic-home.md").exists() else '',
        "honors": "\n".join(f'<li><div><h3>{esc(item["title"])}</h3><p>{esc(item["detail"])}</p></div><time>{esc(item["date"])}</time></li>' for item in profile["honors"]),
        "structured_data": json.dumps({
            "@context": "https://schema.org", "@type": "Person", "name": profile["name"],
            "alternateName": profile["name_zh"], "url": "https://yihaohu0118.github.io/",
            "image": profile["avatar"], "email": profile["email"], "jobTitle": "Ph.D. Student in Artificial Intelligence",
            "affiliation": {"@type": "CollegeOrUniversity", "name": "Westlake University"},
            "sameAs": [profile["github"], profile["scholar"]], "knowsAbout": profile["interests"]
        }, ensure_ascii=False).replace("<", "\\u003c")
    }
    html = re.sub(r"@@([a-z_]+)@@", lambda match: values[match[1]], template)
    assert not re.search(r"@@[a-z_]+@@", html), "Unrendered template token"
    destinations = [ROOT / "_layouts/yihao-home.html"]
    if not (ROOT / "_pages/about.md").exists():
        destinations.append(ROOT / "index.html")
    for destination in destinations:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(html)
    print(f"Built {', '.join(str(p.relative_to(ROOT)) for p in destinations)}: {len(profile['publications'])} publications.")


if __name__ == "__main__":
    render()

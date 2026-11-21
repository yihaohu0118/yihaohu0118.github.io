# Yihao Hu homepage redesign

The redesign follows the dark, monochrome academic presentation of https://donahowe.github.io/: a bilingual introduction, hanging profile card, scrollable news, ticket-shaped education and experience entries, and a horizontal publication collection. The HTML, CSS, JavaScript, and interaction design were implemented independently. Institution logos come from official websites, and selected-publication figures are screenshots of the original arXiv PDFs. The Working Sheet reading fonts are reused under their original MIT license, with the complete notice in `assets/homepage/fonts/`.

## Preview and maintain

Open `index.html` directly in a browser. There is no dependency installation or server requirement. Core content, contact links, and all 18 publications are prerendered and work without JavaScript. Theme switching, motion controls, badge interaction, gallery controls, publication dialogs, and search are progressive enhancements.

Edit `content/profile.json` for academic metadata, `scripts/homepage.template.html` for prose and structure, and `assets/homepage/style.css` / `main.js` for presentation and behavior. From this redesign directory, run:

```sh
python3 scripts/build.py
python3 scripts/check.py
```

Space Grotesk is loaded through Google Fonts, with a system sans-serif fallback. The Working Sheet reading faces, original portrait, institution logos, and all nine selected-paper figures are local assets. Publication images are rendered directly from arXiv PDFs as lossless WebP, cropped around each complete method diagram. `assets/homepage/figures/SOURCES.json` records the versioned PDF URL, page, figure, crop coordinates, and SHA-256 hashes. The earlier conceptual images remain unused compatibility assets; no current publication card references them.

The initial theme is dark. Theme changes apply to the current page. Reduced motion follows the operating-system preference; the footer can also turn motion off. Cards can be opened with the keyboard, dialogs support Escape and return focus to their trigger, and all contact and paper links remain ordinary HTML links.

## Interactive lettering

`assets/homepage/name-interaction.js` adds an independently implemented canvas treatment to both HTML name lines: a nearby letter receives a thin selection frame, corner handles, size labels, a dashed outline, and a small set of animated pixels. Mouse dragging moves an individual letter; release returns it with spring motion. A touch tap gives brief feedback without capturing vertical scrolling.

The underlying heading remains real, readable HTML for assistive technology and browsers without JavaScript. Rendering is capped at device pixel ratio 2, sleeps after all motion settles, and stops when the heading is off screen or the document is hidden. The existing motion toggle and operating-system reduced-motion setting disable the effect. Theme changes redraw the lettering with the matching foreground color. The reading fonts are locally hosted, unmodified MIT-licensed Working Sheet fonts; their source and checksums are recorded in `assets/homepage/fonts/README.md`.

## Integrate into the existing GitHub Pages repository

The original website uses Jekyll and `_pages/about.md` with a root permalink. Copying a second `index.html` into that repository would create an output collision. Keep the Jekyll deployment and use the supplied layout instead.

First obtain a current checkout of `yihaohu0118/yihaohu0118.github.io`. From the redesign directory:

```sh
python3 scripts/install-to-jekyll.py /absolute/path/to/yihaohu0118.github.io --dry-run
python3 scripts/install-to-jekyll.py /absolute/path/to/yihaohu0118.github.io
```

The installer changes the original homepage's layout to `yihao-home`, retaining its source body and redirects. It preserves the original page at `/classic.html` and stores an exact original-source backup with its SHA-256 in `docs/homepage-redesign-backup.json`. It copies only this homepage's assets, data, template, build/check scripts, and maintenance notes. The existing Jekyll configuration, deployment workflow, project pages, and original assets remain in place. It does not create `.nojekyll`, modify Git history, or push anything.

Inside the integrated repository, rebuild and check with:

```sh
python3 scripts/build-homepage.py
python3 scripts/check-homepage.py
```

Review the diff and run the repository's existing Jekyll build before publishing through its established GitHub Pages workflow. Commit the generated `_layouts/yihao-home.html` and homepage assets together with the metadata/source changes. The build script detects Jekyll and does not create a competing root `index.html`.

Before publication, visually review desktop and narrow screens, remote avatar loading, dark/light themes, reduced motion, pointer/keyboard card interaction, dialog close/focus behavior, gallery scrolling, and combined publication category/search filtering. Confirm the original project pages and `/classic.html` still work.

## Prepared publisher

In the separate redesign source directory, `发布主页.command` runs `scripts/publish-to-github.py` from the macOS system terminal. These publication helpers stay in that preparation directory rather than being installed into the original homepage repository. The program uses the user's normal GitHub CLI login, verifies push access and the existing Pages source, and creates a new isolated checkout. If `gh` is missing, it downloads the official macOS release into `.publish-tools/` and verifies its published SHA-256 before running it. Credentials remain with the standard GitHub CLI/keychain flow and Git credential helper.

The publisher integrates the redesign, reuses a verified original portrait from `_config.yml` when available, adds a unique build marker, runs the supplied build and checks, stages only homepage changes, commits, verifies that the remote branch has not changed, and pushes without force. It polls the existing Pages workflow and the public site for the exact build marker. A `publish-result.json` receipt records the actual commit and publication state. Source checkouts are retained for review or recovery. `--prepare-only` stops before committing; `--dry-run` prints the steps without network access or writes.

The launcher was used successfully for the initial publication. It exits immediately if `CODEX_SANDBOX_NETWORK_DISABLED=1` and does not change execution permissions. Follow-up updates can also be published through the authenticated GitHub Git-database API when the Git transport is unavailable: upload the checked blobs/tree, create the commit, and update the existing branch with `force: false`. The Pages workflow and exact public build marker are then verified.

## Content and asset provenance

- Original homepage and history: https://github.com/yihaohu0118/yihaohu0118.github.io/blob/main/_pages/about.md
- Contact details, Scholar ID, education dates, internship dates, academic service, and recent publications were checked against the user's local November 2026 CV in `yihao_hu_cv_updated.zip`.
- ViSS, ChronoReplay, Trajectory2Gym, SEAL, AtlasVA, OmniVideo-R1, and CogSENet were checked against their public arXiv/project/repository records. Other paper URLs and metadata are retained from the existing homepage and local CV. Preprints remain labeled as preprints; submission to a future conference is not presented as acceptance.
- SCOPE is correctly listed as **NeurIPS 2025**, matching its official proceedings, correcting the old homepage's year: https://proceedings.neurips.cc/paper_files/paper/2025/hash/75c2ec5f98d7b2f50ad68033d2c07086-Abstract-Conference.html
- All nine selected-publication images, including DARC, now come directly from the corresponding arXiv PDFs. Screenshots preserve the original graphics without redrawing. Exact source versions, crop coordinates, and checksums are in `assets/homepage/figures/SOURCES.json`; original PDFs were not modified.
- Hainan University's shield is a lossless crop of the image embedded in its official website's logo SVG. Meituan and Ant Group use unmodified official website PNGs. Source pages, download URLs, preparation details, and checksums are in `assets/homepage/logos/SOURCES.json`. The Westlake logo is retained from the user's local research presentation dated 2026-11-12.
- The profile uses an unmodified copy of the original homepage's `images/yihao_head.png`, retained locally as `assets/homepage/portrait.png`. Original repository images remain in place.
- Scholarship and competition information comes from the existing homepage. Inconsistent class-rank figures in different source documents were omitted pending clarification.
- DARC's conference label is **KDD 2026**, following the author's correction on 2026-11-21.
- DARC appears as the second selected-publication card. The current biography and experience cards omit Alibaba · Amap at the author's request; the historical classic-page backup remains a snapshot of the original website.

## Verification in the authoring environment

Python structural/content/resource checks and JavaScript syntax checks passed. The installer was exercised against an isolated Jekyll fixture, including dry run, original-source preservation, repeated installation, and refusal of root-output collisions.

After execution permissions were updated, real Chrome browser checks covered both name lines, hover cleanup, exact spring return, motion controls, operating-system reduced motion, light/dark rendering, touch feedback, vertical scrolling, publication filtering with the retained KDD 2026 correction, modal Escape dismissal, screen-reader heading semantics, and the no-JavaScript fallback. Responsive checks at 320, 375, 390, 768, 1024, and 1440 pixels confirmed no page or navigation overflow. Browser rendering was also inspected in desktop, mobile, hover, drag, and light-theme screenshots.

The arXiv/official-logo update was checked in Chrome at 320, 390, 768, 1024, and 1440 pixel device widths. All four institution images and all nine selected-paper figures decoded successfully, the current page contains two experience cards and 18 publication rows, DARC is the second selected card with the KDD 2026 label, and its enlarged original figure closes with Escape. Desktop/mobile screenshots were reviewed, and source image checksums match both provenance manifests.

Name canvases now paint the idle lettering immediately after each layout, including while off screen, and respond to window resize events. This prevents a cleared canvas from leaving the name blank or retaining desktop dimensions after a narrow-screen transition.

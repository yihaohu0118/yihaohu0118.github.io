# Yihao Hu homepage redesign

The redesign follows the dark, monochrome academic presentation of https://donahowe.github.io/: a bilingual introduction, hanging profile card, scrollable news, ticket-shaped education and experience entries, and a horizontal publication collection. The HTML, CSS, JavaScript, diagrams, and brand treatment were implemented independently; no reference-site code, fonts, photographs, or vendor components were copied.

## Preview and maintain

Open `index.html` directly in a browser. There is no dependency installation or server requirement. Core content, contact links, and all 18 publications are prerendered and work without JavaScript. Theme switching, motion controls, badge interaction, gallery controls, publication dialogs, and search are progressive enhancements.

Edit `content/profile.json` for academic metadata, `scripts/homepage.template.html` for prose and structure, and `assets/homepage/style.css` / `main.js` for presentation and behavior. From this redesign directory, run:

```sh
python3 scripts/build.py
python3 scripts/check.py
```

Google Fonts and the verified GitHub avatar are the only external display resources. Local system fonts and an initials card provide fallbacks if either service is unavailable. All paper figures and conceptual diagrams are local assets. The four independently drawn SVG publication summaries are explicitly captioned “Conceptual overview”; they are not presented as original paper figures.

The initial theme is dark. Theme changes apply to the current page. Reduced motion follows the operating-system preference; the footer can also turn motion off. Cards can be opened with the keyboard, dialogs support Escape and return focus to their trigger, and all contact and paper links remain ordinary HTML links.

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

The launcher has not been run outside the restricted authoring process. It cannot change that process's permission policy; it exits immediately if `CODEX_SANDBOX_NETWORK_DISABLED=1`. Its syntax, dry-run behavior, and policy guard have been checked; remote authentication, GitHub Pages execution, and publication remain unverified until it runs with ordinary network access.

## Content and asset provenance

- Original homepage and history: https://github.com/yihaohu0118/yihaohu0118.github.io/blob/main/_pages/about.md
- Contact details, Scholar ID, education dates, internship dates, academic service, and recent publications were checked against the user's local November 2026 CV in `yihao_hu_cv_updated.zip`.
- ViSS, ChronoReplay, Trajectory2Gym, SEAL, AtlasVA, OmniVideo-R1, and CogSENet were checked against their public arXiv/project/repository records. Other paper URLs and metadata are retained from the existing homepage and local CV. Preprints remain labeled as preprints; submission to a future conference is not presented as acceptance.
- SCOPE is correctly listed as **NeurIPS 2025**, matching its official proceedings, correcting the old homepage's year: https://proceedings.neurips.cc/paper_files/paper/2025/hash/75c2ec5f98d7b2f50ad68033d2c07086-Abstract-Conference.html
- Trajectory2Gym, SEAL, DARC, and AtlasVA figures and the Westlake logo were obtained from the user's local research presentation dated 2026-11-12. ChronoReplay's overview was obtained from the user's local paper materials. Raster figures were resized and compressed as WebP without cropping; originals outside this directory were not modified.
- The profile image uses the verified public GitHub avatar for user ID `150792618`. The original homepage's portrait asset could not be retrieved in this environment. Replace `avatar` in `content/profile.json` with its existing local image path when that source is available; keep the existing portrait file unchanged.
- Scholarship and competition information comes from the existing homepage. Inconsistent class-rank figures in different source documents were omitted pending clarification.

## Verification in the authoring environment

Python structural/content/resource checks and JavaScript syntax checks passed. The installer was exercised against an isolated Jekyll fixture, including dry run, original-source preservation, repeated installation, and refusal of root-output collisions.

The authoring environment prevents local network listeners and outbound shell networking; launching the installed browser also failed. Desktop/mobile rendering and pointer interaction have therefore not been verified in a real browser. GitHub access is not connected, so no remote commit or deployment has been performed.

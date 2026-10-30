# ryanjgallag.com

Personal website, built with [Astro](https://astro.build) on top of the
[astro-scholar](https://github.com/whydevils/astro-scholar) theme. The experience timeline and
"What I work with" sections on the About page are adapted from the
[astro-wanderer](https://github.com/igagansingh/astro-wanderer) theme. Please see their licenses in 
`licenses/`.

Deployed to GitHub Pages by `.github/workflows/deploy.yaml` on every push to `main`.

## Where things live

Most content lives in `src/content/`, which some exceptions.

| Path | What it holds |
|---|---|
| `src/content/site.yaml` | Your name, site description, and the contact icons (order matters) |
| `src/content/pages/home.md` | The home page |
| `src/content/pages/about.mdx` | The About page |
| `src/content/publications/*.md` | One file per paper |
| `src/content/publications/images/` | Paper images (resized automatically at build) |
| `src/content/citations.json` | Google Scholar citation counts, keyed by publication filename. Updated with `make citations`; papers without a `scholarId` keep hand-entered counts |
| `src/assets/portrait.jpg` | Portrait photo. Other images go in `src/assets/` too |
| `public/files/` | Slides and data files to share with others |
| `src/data/link-types.ts` | Kinds of publication links, with their default label and icon |

## Everyday commands

Run `make` to see them all.

| Command | What it does |
|---|---|
| `make serve` | Run the site at http://localhost:4321 (drafts are shown) |
| `make citations` | Update citation counts from Google Scholar (`dry_run=1` to preview) |
| `make new-publication id=gallagher2026example` | Start a publication page at `/publications/<id>/` |
| `make build` | Build the site; fails if any paper has missing/invalid fields |
| `make check` | Check data and types without building |

## Publications

Each publication is one file in `src/content/publications/`. Start one with `make new-publication id=...`.


### Required

| Field | What it does |
|---|---|
| `title` | The publication's title |
| `authors` | List of names, in order (YAML style). Names in `authorNames` (`site.yaml`) are shown in bold and decide the "Authorship" filter (first author or co-author) |
| `venue` | Where the publication was published |
| `year` | When the publication was publisehd |
| `type` | One of `journal`, `conference`, `preprint`, `report`, `chapter`, `thesis`. Sets the "Type" filter and the kind of BibTeX entry |
| `peerReviewed` | `true` or `false`. Shows the red check mark and sets the "Peer-reviewed" filter |
| `categories` | One or more categories from `src/content/categories.yaml`. A category must be specified there to register correctly with a publication. Sets the "Topic" filter and the tags on the paper's page. |

### Optional

| Field | What it does |
|---|---|
| `doi` | e.g. `10.1371/journal.pone.0195644`. Adds a DOI link and goes into the BibTeX entry and Google Scholar tags |
| `links` | The paper's links (see below) |
| `scholarId` | The paper's Google Scholar ID, so `make citations` can find its count: open the paper on your Scholar profile and copy the part after the colon in `citation_for_view=...` |
| `excludeFromCitations` | `true` hides the citation count and lists the paper last when sorting by citations. Use it when a count doesn't make sense (e.g. the paper isn't on Scholar). Without it, papers with no count show 0 |
| `image` | A figure, e.g. `./images/<id>.png` (file in `publications/images/`). Used for the link preview when the page is shared; without one, previews uses your portrait photo |
| `imageAlt` | A description of the image. Not shown anywhere yet |
| `awards` | List of awards, e.g. `[Best Paper Award]`. Shown on the paper's page |
| `note` | Shown above the abstract, e.g. a content warning. |
| `volume`, `issue`, `pages` | Added to the BibTeX entry |
| `publisher` | Added to the BibTeX entry. For reports, the institution; for theses, the university |
| `editors` | List of editor names, for chapters and proceedings. Added to the BibTeX entry |
| `draft` | `true` hides the paper from the live site; it still shows in `make serve`. New papers start as drafts |

### Links

Each entry in `links` has a `type` and a `url`, plus optional extras:

```yaml
links:
  - type: article
    url: https://...
    label: Report           # optional: replaces the default label ("Article")
    openAccess: true        # optional: shows the open access icon
  - type: code
    url: https://github.com/...
    icon: fa6-brands:python # optional: replaces the default icon
```

- **Types:** `article`, `acm`, `arxiv`, `osf`, `preprint`, `pdf`, `code`, `slides`, `data`,
  `dashboard`, `video`, `website`, `other`. Their default labels and icons are in `src/data/link-types.ts`.
- **On the publications list:** an opened card shows only the published version (`article`, `acm`, DOI).
  If there isn't one, it shows the preprint instead.
- **PDF links:** use `pdf` for a copy of the paper you host yourself, e.g. put the file in
  `public/files/papers/` and link to `/files/papers/<id>.pdf`. Besides showing a "PDF" link, it tells Google Scholar where the full text is, so Scholar can show a [PDF] link to your site next to the paper. Optional: without one, Scholar still indexes the
  page from its title, authors, and abstract.

## Icons

Icons are referenced by [Iconify](https://icon-sets.iconify.design) name, e.g. `academicons:arxiv` or
`fa6-brands:python`. Installed sets: `fa6-solid`, `fa6-regular`, `fa6-brands`, `academicons`.

- Use another set: `npm install @iconify-json/<set>`.
- Use a custom icon: put `my-icon.svg` in `src/icons/` and refer to it as `my-icon`.
- New kind of publication link: add a line to `src/data/link-types.ts`.

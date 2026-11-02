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
| `src/content/blog/*.md` | One file per blog post |
| `src/content/citations.json` | Google Scholar citation counts, keyed by publication filename. Updated with `make citations`; a GitHub Action opens a pull request each month as a reminder, with the steps (`.github/workflows/citations.yaml`); papers without a `scholarId` keep hand-entered counts |
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
| `make new-post title="My post title"` | Start a blog post (as a draft) at `/blog/<my-post-title>/` |
| `make publish-blog` | Send blog posts to your PDS as standard.site records; GitHub does this after each deploy (`dry_run=1` to preview) |
| `make build` | Build the site; fails if any post or paper has missing/invalid fields |
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

## Blog

Each post is one Markdown file in `src/content/blog/`. Start one with `make new-post title="..."`.
The filename, made from the title, becomes the URL: "What's new?" -> `whats-new.md` -> `/blog/whats-new/`.
You can rename the file before the post is published; after that, renaming it changes the URL.

| Field | What it does |
|---|---|
| `title` | Required. The post's title |
| `publishedAt` | Required. The date it was published, e.g. `2026-11-01`. Posts are listed newest first |
| `atprotoRkey` | Required. The post's standard.site ID, filled in by `make new-post`. Never change it |
| `description` | A one-line summary, shown on the blog page and in link previews |
| `updatedAt` | The date of a later edit |
| `tags` | List of tags, e.g. `[research, tools]`. Sets the tag filter on the blog page |
| `image` | e.g. `./images/<post>.png` (file in `src/content/blog/images/`). Used for the link preview and as the post's cover image on standard.site; without one, previews use your portrait photo. Not shown on the page itself; to show it in the post too, add it to the text: `![Description](./images/<post>.png)` |
| `draft` | `true` hides the post from the live site and from standard.site; it still shows in `make serve`. New posts start as drafts |

### standard.site

The blog follows [standard.site](https://standard.site), so each post is also saved as a record on your PDS, where other apps on the Atmosphere can find and show it.

- **Publishing:** after each deploy, GitHub runs `scripts/publish-standard-site.mjs`. It creates
  records for new posts, updates edited ones, and removes the records of posts that were deleted or set
  back to draft.
- **IDs:** your account's DID and the blog's record ID are in `site.yaml` under `standardSite`. Don't
  change them once the blog is published.
- **Icon:** the blog's icon (its avatar on Bluesky link cards) is made from `public/favicon.svg`.
- **Password:** publishing needs a Bluesky app password (Bluesky: Settings → Privacy and security → App
  passwords), saved as the repository secret `BLUESKY_APP_PASSWORD`. To run `make publish-blog` on
  your own computer, give it the password with the command: `BLUESKY_APP_PASSWORD=... make publish-blog`.

## Icons

Icons are referenced by [Iconify](https://icon-sets.iconify.design) name, e.g. `academicons:arxiv` or
`fa6-brands:python`. Installed sets: `fa6-solid`, `fa6-regular`, `fa6-brands`, `academicons`.

- Use another set: `npm install @iconify-json/<set>`.
- Use a custom icon: put `my-icon.svg` in `src/icons/` and refer to it as `my-icon`.
- New kind of publication link: add a line to `src/data/link-types.ts`.

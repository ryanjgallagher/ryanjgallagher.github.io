// Kinds of links a publication can have, with the default label and icon for each.
//
// To add a new kind of link, add a line here. Any publication can still
// override the label or icon for a single link in its own file.
//
// Icons are Iconify names (browse at https://icon-sets.iconify.design). Installed sets:
// fa6-solid, fa6-regular, fa6-brands, academicons. To use another set, run
// `npm install @iconify-json/<set>`. For a custom icon, drop an SVG into src/icons/
// and use its filename (e.g. `icon: my-logo`).

// `group` decides where a link shows on a paper's page: with the paper itself, or under materials.
export const LINK_TYPES = {
    article: { label: 'Article', icon: 'fa6-solid:book-open', group: 'paper' },
    acm: { label: 'ACM Digital Library', icon: 'academicons:acm', group: 'paper' },
    arxiv: { label: 'Preprint', icon: 'academicons:arxiv', group: 'paper' },
    osf: { label: 'Preprint', icon: 'academicons:osf', group: 'paper' },
    preprint: { label: 'Preprint', icon: 'fa6-regular:file-lines', group: 'paper' },
    pdf: { label: 'PDF', icon: 'fa6-regular:file-pdf', group: 'paper' },
    code: { label: 'Code', icon: 'fa6-brands:github', group: 'materials' },
    slides: { label: 'Slides', icon: 'fa6-regular:file-powerpoint', group: 'materials' },
    data: { label: 'Data', icon: 'fa6-solid:database', group: 'materials' },
    dashboard: { label: 'Dashboard', icon: 'fa6-solid:gauge-high', group: 'materials' },
    video: { label: 'Video', icon: 'fa6-solid:video', group: 'materials' },
    website: { label: 'Website', icon: 'fa6-solid:globe', group: 'materials' },
    other: { label: 'Link', icon: 'fa6-solid:link', group: 'materials' },
} as const;

export type LinkType = keyof typeof LINK_TYPES;

// Which links show on the publications list page (when a card is opened). Paper pages show everything.
//   - If the paper has a published-version link and/or a DOI, show those.
//   - Otherwise, show its preprint link(s).
export const PUBLISHED_LINK_TYPES: LinkType[] = ['article', 'acm'];
export const PREPRINT_LINK_TYPES: LinkType[] = ['arxiv', 'osf', 'preprint'];

export const DOI_ICON = 'academicons:doi';
export const AWARD_ICON = 'fa6-solid:award';
export const PEER_REVIEWED_ICON = 'fa6-solid:circle-check';
// Shown after any link marked `openAccess: true`
export const OPEN_ACCESS_ICON = 'academicons:open-access';

// Labels for the `type` field on publications, in the order they appear in filters.
export const PUBLICATION_TYPES = {
    journal: 'Journal',
    conference: 'Conference',
    preprint: 'Preprint',
    report: 'Report',
    chapter: 'Chapter',
    thesis: 'Thesis',
} as const;

export type PublicationType = keyof typeof PUBLICATION_TYPES;

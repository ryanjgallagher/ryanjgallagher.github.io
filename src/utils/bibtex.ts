// Builds a BibTeX entry for a publication, for the "Cite" button on its page.
// Everything comes from the paper's Markdown file; nothing is fetched.
import { SITE_DATA } from '../constants';
import type { Publication } from './publications';

// Paper type -> BibTeX entry type, and which field the venue goes in
const ENTRY: Record<Publication['data']['type'], { type: string; venueField: string }> = {
    journal: { type: 'article', venueField: 'journal' },
    conference: { type: 'inproceedings', venueField: 'booktitle' },
    chapter: { type: 'incollection', venueField: 'booktitle' },
    report: { type: 'techreport', venueField: 'type' },
    preprint: { type: 'misc', venueField: 'howpublished' },
    thesis: { type: 'phdthesis', venueField: 'type' },
};

// Accented letters -> LaTeX, so older BibTeX setups handle them: é -> {\'e}
const ACCENTS: Record<string, string> = {
    '́': "'", // acute
    '̀': '`', // grave
    '̈': '"', // umlaut
    '̂': '^', // circumflex
    '̃': '~', // tilde
    '̧': 'c', // cedilla
};

function latex(text: string): string {
    return text
        .normalize('NFD')
        .replace(/([A-Za-z])([̀-ͯ])/g, (_match, letter: string, mark: string) =>
            ACCENTS[mark] ? `{\\${ACCENTS[mark]}${ACCENTS[mark] === 'c' ? ' ' : ''}${letter}}` : letter,
        )
        .replace(/[̀-ͯ]/g, '')
        .replace(/([&%#_$])/g, '\\$1')
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/—/g, '---')
        .replace(/–/g, '--');
}

/** "Brooke Foucault Welles" -> "Foucault Welles, Brooke" (multi-word last names are listed in site.yaml) */
function lastFirst(name: string): string {
    const compound = SITE_DATA.compoundSurnames.find((s) => name.endsWith(` ${s}`));
    const last = compound ?? name.split(' ').at(-1)!;
    const first = name.slice(0, name.length - last.length).trim();
    return first ? `${last}, ${first}` : last;
}

const names = (list: string[]) => list.map((n) => latex(lastFirst(n))).join(' and ');

export function bibtex(pub: Publication): string {
    const d = pub.data;
    const entry = ENTRY[d.type];
    const fields: [string, string | undefined][] = [
        ['title', latex(d.title)],
        ['author', names(d.authors)],
        ['editor', d.editors.length ? names(d.editors) : undefined],
        [entry.venueField, latex(d.venue)],
        ['volume', d.volume],
        ['number', d.issue],
        ['pages', d.pages?.replace(/(\d)\s*-\s*(\d)/, '$1--$2')],
        ['year', String(d.year)],
        [d.type === 'report' ? 'institution' : d.type === 'thesis' ? 'school' : 'publisher', d.publisher && latex(d.publisher)],
        ['doi', d.doi],
        // Without a DOI, point to the first link instead
        ['url', d.doi ? undefined : d.links[0]?.url],
    ];
    const body = fields
        .filter(([, value]) => value)
        .map(([key, value]) => `  ${key} = {${value}}`)
        .join(',\n');
    return `@${entry.type}{${pub.id},\n${body}\n}`;
}

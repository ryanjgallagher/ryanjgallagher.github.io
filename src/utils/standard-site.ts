// AT Protocol addresses for standard.site records. The IDs live in src/content/site.yaml
// (the blog's publication) and in each post's front matter (atprotoRkey).
import { SITE_DATA } from '../constants';

const { did, publicationRkey } = SITE_DATA.standardSite;

/** The blog's site.standard.publication record */
export const publicationUri = `at://${did}/site.standard.publication/${publicationRkey}`;

/** A post's site.standard.document record */
export const documentUri = (rkey: string) => `at://${did}/site.standard.document/${rkey}`;

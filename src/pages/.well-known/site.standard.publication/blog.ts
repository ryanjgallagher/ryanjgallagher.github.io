// Served at /.well-known/site.standard.publication/blog so standard.site apps can confirm
// this website owns the blog's publication record. The blog lives at /blog, so its name goes
// at the end (https://standard.site/docs/verification/#non-root-publications).
import type { APIRoute } from 'astro';
import { publicationUri } from '../../../utils/standard-site';

export const GET: APIRoute = () => new Response(publicationUri, { headers: { 'Content-Type': 'text/plain' } });

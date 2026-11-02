// Served at /.well-known/site.standard.publication so standard.site apps can confirm
// this website owns the blog's publication record.
import type { APIRoute } from 'astro';
import { publicationUri } from '../../utils/standard-site';

export const GET: APIRoute = () => new Response(publicationUri, { headers: { 'Content-Type': 'text/plain' } });

// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://ryanjgallag.com',
  integrations: [icon(), mdx()],
  devToolbar: { enabled: false },
  // Old Jekyll pages that no longer exist. Publication URLs are unchanged.
  redirects: {
    '/research': '/about/',
    '/contact': '/about/',
    '/teaching': '/',
    '/code': '/',
    '/code/corex/overview': '/',
    '/code/word_shift/overview': '/',
    '/code/sbms/overview': '/',
  },
});

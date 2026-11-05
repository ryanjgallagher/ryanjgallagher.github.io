// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://ryanjgallag.com',
  integrations: [icon(), mdx()],
  devToolbar: { enabled: false },
  // Code block colors (Shiki themes: https://shiki.style/themes). The dark one is switched on
  // with the site's dark mode in src/styles/blog.css.
  markdown: {
    shikiConfig: {
      themes: { light: 'one-light', dark: 'one-dark-pro' },
    },
  },
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

// RSS feed at /blog/rss.xml, for feed readers. Built with the site from the same posts as the blog
// page (drafts only show in `make serve`), with each post's full text.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { SITE_DATA } from '../../constants';
import { getPosts } from '../../utils/blog';

export const GET: APIRoute = async ({ site }) => {
    const posts = await getPosts();
    // Renders a post's text to HTML the same way its page does, including images
    const container = await AstroContainer.create();

    const items = await Promise.all(
        posts.map(async (post) => {
            const { Content } = await render(post);
            // Feed readers show posts away from the site, so links and images need full addresses:
            // /_astro/figure.png -> https://ryanjgallag.com/_astro/figure.png
            const content = (await container.renderToString(Content)).replace(/(src|href)="\//g, `$1="${site!.origin}/`);
            return {
                title: post.data.title,
                description: post.data.description,
                pubDate: post.data.publishedAt,
                link: `/blog/${post.id}/`,
                categories: post.data.tags,
                content,
            };
        }),
    );

    return rss({
        title: `${SITE_DATA.name} | Blog`,
        description: SITE_DATA.description,
        // The feed's own link: the blog page (post links above start with /, so they still work)
        site: new URL('/blog/', site),
        items,
        customData: '<language>en-us</language>',
    });
};

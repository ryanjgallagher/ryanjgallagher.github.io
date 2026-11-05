---
title: "Hello, World"
description: "And hello, standard.site"
publishedAt: 2026-11-05
tags: [PhD]
draft: false
atprotoRkey: 3mzkssqo2ih2l  # standard.site ID. Don't change.
---

I originally made my personal website in June 2020, in the middle of grad school and at the start of the pandemic. I remember it took me two full weeks working on it, trying to figure out how to alter the theme and adjust components with little knowledge of HTML, CSS, or Javascript. It was a lot of work, but I was happy with it at the time and it served me well while I was in academia.

My site has been due for an upgrade for a few years now. So, after finishing my commitment to not code anything else until I finished [WordLevel](https://github.com/ryanjgallagher/wordlevel) (a successor to my earlier package Shifterator), it was time. I decided I wanted a few things:

- **A simple home page.** The old one had a lot of jumping off points for research, teaching, and code. I'm not in academia anymore, and I'm not trying to sell myself so hard, so that could all go.
- **A consolidated and updated About page.** I've gotten a bit lazy keeping my bio on my personal site up to date, instead opting to just keep my LinkedIn updated. And so, my bio was still quite research focused and not reflective of my experience or interests from industry over the past 4–5 years. I wanted a page that will be easier for me to keep relevant over time.
- **A dedicated page for my publications.** I'm still proud of the work I did in academia and hope to one day get to publish again. One thing I liked on my site was that each publication had its own page with more details and structure. I wanted to keep that. I've also always really liked the sorting and filtering mechanisms my former advisor [Peter Dodds](https://pdodds.w3.uvm.edu/research/papers/) has on his page. That's something I wanted to replicate.
- **A blog!** And here you are! I've had thoughts I've wanted to publish but it was a hassle to get it started on my previous site, and I wasn't sure I wanted to go down one of the more dedicated routes like Ghost. I certainly wasn't going to create a Substack.

So, I got to work brainstorming with Claude. Here was my initial prompt to Claude Opus 5.5 (high effort):

> This directory contains my personal website, which is hosted on Github pages. I want to create a new version, basically from scratch. Here is what I would like to preserve:
> - It is hosted on Github pages
> - It has a home page
> - It has an About Me page
> - It has pages for my research papers
> 
> I do not want to preserve the following:
> - The teaching page
> - The code related pages
> - Hosting the CV
> - The separate contact page. They should be integrated in something like a header and footer just with icons
> 
> I want us to choose a framework that will allow me to pick a theme and adjust it, but that we don't have to build everything entirely from scratch. I would like to maintain the idea of the publication pages, where they can be landing pages with a variety of publication information, including the name, authors, journal, abstract, an image, links to the published version, open source version, slides, datasets, and mentions of awards. etc. For new features:
> - I would possibly be interested in being able to filter and search through publications. 
> - I would like to try and set up some kind of automated workflow to get the number of citations for each publication from Google scholar
> - I would like a blog surface. This might be something that we could integrate with Ghost? I'm not sure. Relatedly, if we did that, I would like to try and support the new standard.site format for the AT Protocol.
>
> Start investigating the contours of what we may be able to do in this space if we start from scratch. The only things that you have to keep are publication-related artifacts, as mentioned above. The rest can basically be recreated from the ground up depending on the approach we take.
>
> I want to discuss possible avenues

One of my main early requirements was being able to use a framework that had templates available (for sites on Github Pages, for example), but was flexible enough to allow customization. I was open to staying with [Jekyll](https://jekyllrb.com/) and [Bulma](https://bulma.io/documentation/features/themes/) from my previous site, but I only picked them originally because there was a lot of documentation on Jekyll and Github Pages, and I liked the Bulma theme. This time, I ended up going with [Astro](https://astro.build/themes/) after deciding I liked the [astro-scholar](https://github.com/whydevils/astro-scholar) theme.

From there, the rest was created. There's no need to get into the details (or that's at least a separate post), but it is _shocking_ how quickly the site came together with the assistance of Claude versus how much time it took me to do even smaller customizations in grad school. Six years ago, it would have taken me those two weeks to make the small formatting changes I wanted. Updating the default searching and filtering from the default would have never been possible for me. Instead, now, it was just a 30 second ask every time I wanted to make even a major adjustment.

I pushed out the new site last week, and I am quite pleased with it. This blog post is the last part of the revamp: adding a blog to the site. In particular, I was really interested in making it compatible with [standard.site](https://standard.site/), which I have seen on Bluesky and the Atmosphere as a shared standard for blogging and storing blog posts as records on PDSs. Again, Claude was immensely helpful implementing it, and we even set up an RSS feed on the way!

Here's my first blog post documenting this moment. It's likely I will fail to make a habit of posting, but at least now I have an easy option for doing so!
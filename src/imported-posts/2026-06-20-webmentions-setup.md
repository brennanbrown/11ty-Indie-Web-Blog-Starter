---
title: "How Webmentions Work on brennan.day"
date: 2026-06-20T12:00:00-06:00
tags: ["IndieWeb", "technical", Eleventy, webmentions, microformats]
description: "A tutorial and walkthrough of how I implemented webmentions on my site, from setup to display, including webmention.io integration, Eleventy filters, CSS styling, and Bridgy for sending."
summary: "A tutorial and walkthrough of how I implemented webmentions on my site, from setup to display, including webmention.io integration, Eleventy filters, CSS styling, and Bridgy for sending."
featured_image: /assets/images/blog/webmentions.jpg
atproto_image: assets/images/atproto/webmentions.jpg
featured_image_alt: "Hand-colored 19th-century political cartoon (labeled 'N° 1') satirizing the Catholic Emancipation debate in Ireland/Britain. A crowded room of men in formal coats and a few barristers in robes sit and stand around tables, gesturing animatedly. Eleven numbered speech balloons rise above the group, debating a 'cat let out of the bag' metaphor for a doctor's (likely a Catholic Board spokesman's) admission about an oath against subverting the Protestant Church, with characters worrying that 'Orangemen' will seize on the remark and invoking memories of 1798. In the upper right corner stands a harp topped with a cross beside a 'Senatorial Catholic Board' placard. At far right, a well-dressed man sits in a red armchair holding a scroll labeled with a list of penal laws against Protestants. At far left, on an elevated wooden platform, two onlookers labeled 'Orange Boven' watch the scene and comment from above."
featured_image_caption: "Thomas Dromgoole speaking at a meeting of the Catholic Board in Dublin; represented as Doctor Drum 'letting the cat out of the bag'. Coloured etching, 1813. | [Wellcome Collection](https://wellcomecollection.org/works/dhdwjkae/images?id=jgennxqh) (edited by the Author)"
collection: [indieweb, technical-tutorials]
atUri: "at://did:plc:h4fm3emeptzegfs452eoiaz7/site.standard.document/3mqaajw57c32z"
---

It's been awhile since I've written a technical breakdown looking at specific functionality on my site. I actually wrote that [I would post a tutorial on how Webmentions work](https://brennan.day/building-brennan-day-part-two-indieweb-new-features-and-three-months-of-iterations/#webmentions-display) on my site... but then never did. And that was all the way back in March! It's June now, somehow. It's actually almost July. What the heck?

Anyways, my friend [Melo](https://bubblegum.girlonthemoon.xyz/) runs a blog using a custom Rails solution (which is far more impressive than my simple static blog) and I hope this walkthrough can help her and anyone else with their own IndieWeb site integrate these cross-site interactions! It's been one of the neatest features on my site, in my opinion.

## What Are Webmentions, Anyways?

Good question. Webmentions enable notifications across websites, and are a [W3C Recommendation](https://www.w3.org/TR/2017/REC-webmention-20170112/). 

If somebody links to your content from their own site, then the server involved can send a webmention to your endpoint, which allows you to both receive and display likes, reposts, replies and mentions. You can think of it being similar to the functionality of various social media platforms, but decentralized.

For example, when Alice writes a post on her blog and Bob writes a response (linking back to Alice), Bob's publishing software will send a webmention to Alice notifying her that her article was replied to, and Alice's software can show the reply as a comment on the original post. And Bob and Alice can be using whatever web tech they feel like to make it happen!

## Webmention.io (Being a Static Site)

As you might know, brennan.day is a static site built with [Eleventy](https://www.11ty.dev/) and deployed via Netlify. Static sites can't receive real-time webmention POST requests, as there's no running server to handle them. When someone sends a webmention, there's nothing there to catch it.

Luckily, there's [webmention.io](https://webmention.io/) which acts as an intermediary. It's a hosted service created by [Aaron Parecki](https://aaronparecki.com/) that handles receiving webmentions on behalf of your site. The flow is:

1. Other sites send webmentions to https://webmention.io/brennan.day/webmention
2. webmention.io validates the mention (checking that the source actually links to the target)
3. webmention.io parses the microformats on the source page to extract author info, content, etc.
4. During my Eleventy build, I fetch all mentions from webmention.io's API
5. The mentions are baked into the static HTML as it's generated

The mentions only appear whenever the site rebuilds, rather than in real-time, but I am building this site on a near daily-basis, so that works fine for me.

## Setting Up webmention.io

First, sign up at [webmention.io](https://webmention.io/). It's free and open-source. Once you've signed in and verified your domain, you'll get an API token. Like with all API tokens, keep this secret! It's what lets you fetch your mentions.

I store the token as an environment variable:

```bash
# In .env
WEBMENTION_IO_TOKEN=your_token_here
```

Never commit this to git. Add .env to your .gitignore if you haven't already.

## Declaring Your Endpoint

For other sites to know where to send webmentions, you need to declare your endpoint in your HTML head. In my `src/_includes/layouts/base.njk`:

```html
<link rel="webmention" href="{{ site.indieweb.webmentionIo }}">
```

This tells webmention senders: "Hey, if you want to notify me about a link, send it here." The spec actually supports three methods of discovery: HTTP Link headers, `<link>` elements, and `<a>` elements. The `<link rel="webmention">` in the head is the most common.

## Fetching Mentions During Build

Here's where the logic comes into play. I have a data file at `src/_data/webmentions.js` that Eleventy runs during the build:

```javascript
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  const domain = "brennan.day";
  const token = process.env.WEBMENTION_IO_TOKEN;
  
  if (!token) {
    console.warn("No WEBMENTION_IO_TOKEN found. Skipping webmention fetch.");
    return { children: [] };
  }
  
  const url = `https://webmention.io/api/mentions.jf2?domain=${domain}&token=${token}&per-page=1000`;
  
  try {
    const response = await EleventyFetch(url, {
      duration: "6h",
      type: "json"
    });
    
    console.log(`Fetched ${response.children.length} webmentions`);
    return response;
  } catch(e) {
    console.error("Error fetching webmentions:", e);
    return { children: [] };
  }
};
```

I'm using [Eleventy Fetch](https://www.11ty.dev/docs/plugins/fetch/) here, a plugin that caches network requests locally. I don't want to hit the webmention.io API on every single build during development. The `duration: "6h"` means the response is cached for six hours, so I can rebuild locally without hammering their servers. That's important!

The API returns data in [JF2 format](https://www.w3.org/TR/jf2/) (JSON Feed 2.0), which is a nice structured format for feeds. The response looks something like this:

```json
{
  "type": "feed",
  "name": "Webmentions",
  "children": [
    {
      "type": "entry",
      "author": {
        "type": "card",
        "name": "Someone",
        "url": "https://their-site.com/",
        "photo": "https://their-site.com/avatar.jpg"
      },
      "url": "https://their-site.com/my-reply",
      "published": "2026-01-15T10:00:00-07:00",
      "wm-property": "in-reply-to",
      "wm-target": "https://brennan.day/my-post",
      "content": {
        "text": "Great post! I really enjoyed reading this."
      }
    }
  ]
}
```

## Processing Mentions with Filters

Now, raw webmention data isn't very useful on its own. I need to filter it down to what's relevant for each page. I've got a few custom filters in `config/filters.js` that handle this.

### Getting Mentions for a Specific URL

The `getWebmentionsForUrl` filter filters all mentions to find only those targeting the current page:

```javascript
eleventyConfig.addFilter("getWebmentionsForUrl", (webmentions, url) => {
  if (!webmentions) return [];
  const entries = Array.isArray(webmentions) ? webmentions : (webmentions.children || []);
  return entries.filter(entry => entry["wm-target"] === url);
});
```

In my templates, I use it like this:

{% raw %}
```njk
{% set mentions = webmentions.children | getWebmentionsForUrl(site.url + page.url) %}
```
{% endraw %}

### Grouping by Type

Not all mentions are the same. Someone might like your post, repost it, reply to it, or just mention it in passing. The `webmentionsByType` filter handles this:

```javascript
eleventyConfig.addFilter("webmentionsByType", (mentions, type) => {
  if (!mentions || !Array.isArray(mentions)) {
    return [];
  }
  return mentions.filter(entry => entry["wm-property"] === type);
});
```

The types I care about are:
- `like-of` - Someone bookmarked or liked the content
- `repost-of` - Someone shared or reposted the content
- `in-reply-to` - Someone replied to the content
- `mention-of` - General mention of the content

In my template, I split them out:

{% raw %}
```njk
{% set likes = mentions | webmentionsByType('like-of') %}
{% set reposts = mentions | webmentionsByType('repost-of') %}
{% set replies = mentions | webmentionsByType('in-reply-to') %}
{% set allMentions = mentions | webmentionsByType('mention-of') %}
```
{% endraw %}

## Displaying Mentions

I display webmentions on both posts and notes. The logic is identical, so I'll walk through the post template in `src/_includes/layouts/post.njk`.

### Likes and Reposts

Likes and reposts are displayed as grids of avatars. It's a nice visual way to show engagement without taking up too much space:

{% raw %}
```njk
{% if likes.length > 0 %}
<div class="webmention-likes">
  <h3>{{ likes.length }} Like{{ 's' if likes.length != 1 }}</h3>
  <div class="webmention-avatars">
    {% for like in likes %}
    <a href="{{ like.author.url if like.author.url else like.url }}" 
       title="{{ like.author.name }}" 
       target="_blank" 
       rel="noopener" 
       class="no-external-icon">
      {% if like.author.photo and like.author.photo != '' %}
      <img src="{{ like.author.photo }}" 
           alt="{{ like.author.name }}" 
           class="webmention-avatar" 
           loading="lazy">
      {% else %}
      <span class="webmention-avatar webmention-avatar--placeholder">
        {{ like.author.name | truncate(1) }}
      </span>
      {% endif %}
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}
```
{% endraw %}

I handle the case where someone doesn't have an author photo by falling back to a placeholder with their first initial. It's a small detail, but it keeps the layout from breaking.

### Replies

Replies get more space, since they're displayed as full comment cards:

{% raw %}
```njk
{% if replies.length > 0 %}
<div class="webmention-replies">
  <h3>{{ replies.length }} Repl{{ 'ies' if replies.length != 1 else 'y' }}</h3>
  {% for reply in replies %}
  <div class="webmention-reply">
    <div class="webmention-reply__header">
      {% if reply.author.photo and reply.author.photo != '' %}
      <img src="{{ reply.author.photo }}" 
           alt="{{ reply.author.name }}" 
           class="webmention-avatar" 
           loading="lazy">
      {% endif %}
      <div class="webmention-reply__meta">
        <strong>{{ reply.author.name }}</strong>
        <a href="{{ reply.url }}" 
           target="_blank" 
           rel="noopener" 
           class="webmention-reply__date no-external-icon">
          {{ reply.published | readableDate }}
        </a>
      </div>
    </div>
    {% if reply.content.text %}
    <p class="webmention-reply__content">
      {{ reply.content.text | truncate(280) }}
    </p>
    {% endif %}
  </div>
  {% endfor %}
</div>
{% endif %}
```
{% endraw %}

I truncate reply content to 280 characters to keep things tidy. If someone wrote a longer response, they can click through to read the full thing on their site.

### Mentions

General mentions are displayed as a simple list of links:

{% raw %}
```njk
{% if externalMentions.length > 0 %}
<div class="webmention-mentions">
  <h3>{{ externalMentions.length }} Mention{{ 's' if externalMentions.length != 1 }}</h3>
  <ul class="webmention-mention-list">
    {% for mention in externalMentions %}
    <li>
      <a href="{{ mention.url }}" 
         target="_blank" 
         rel="noopener" 
         class="no-external-icon">
        {% if mention.author.name and mention.author.name != '' %}
          {{ mention.author.name }} — 
        {% endif %}
        {{ mention.url }}
      </a>
    </li>
    {% endfor %}
  </ul>
</div>
{% endif %}
```
{% endraw %}

I filter out self-mentions (where the source URL starts with my own domain) so I'm not cluttering things up with internal links.

### The CSS

Here's the CSS that styles all of this. It's in my `src/assets/css/08-features.css` file:

```css
.webmentions {
  margin: 2rem 0;
}

.webmention-avatars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.webmention-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.webmention-avatar:hover {
  transform: scale(1.15);
  opacity: 0.85;
}

.webmention-avatar--placeholder {
  background: var(--panel);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.webmention-reply {
  border-left: 3px solid var(--border);
  padding: 0.6rem 0.9rem;
  margin-bottom: 0.75rem;
}

.webmention-reply__header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.webmention-reply__date {
  font-size: 0.8rem;
  color: var(--muted);
}
```

The avatars are grouped together, and the replies get a left border to distinguish them from regular content, and everything uses pre-declared CSS variables for theming. I also make sure I have placeholder avatars in the event an author doesn't have one, which are just circles with the first letter of the author's name.

### Collecting All Mentions on the Press Page

I also have a `/press` page that collects all general mentions (not likes, reposts, or replies) from across my site. This is useful for seeing who's linking to my content in general, even if it's not a direct reply.

The template uses the `groupExternalMentions` filter I mentioned earlier:

{% raw %}
```njk
{% if webmentions and webmentions.children %}
{% set pressMentions = webmentions.children | groupExternalMentions(site.url, collections.all) %}
{% for group in pressMentions %}
<div class="press-mention-group">
<p><strong><a href="{{ group.target }}" class="no-external-icon">{{ group.title }}</a></strong></p>
<ul>{% for mention in group.mentions %}<li><a href="{{ mention.url }}" class="no-external-icon">{{ mention.url }}</a></li>{% endfor %}</ul>
</div>
{% endfor %}
{% endif %}
```
{% endraw %}

The `groupExternalMentions` filter (in `config/filters.js`) does the heavy lifting:

```javascript
eleventyConfig.addFilter("groupExternalMentions", (entries, siteUrl, allPages) => {
  if (!entries || !Array.isArray(entries)) return [];
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const titleMap = {};
  if (Array.isArray(allPages)) {
    for (const p of allPages) {
      if (p.url && p.data && p.data.title) {
        const key = (normalizedSiteUrl + p.url).replace(/\/$/, "");
        titleMap[key] = p.data.title;
      }
    }
  }
  const grouped = {};
  for (const m of entries) {
    if (m["wm-property"] !== "mention-of") continue;
    if (!m.url || m.url.startsWith(normalizedSiteUrl)) continue;
    const rawTarget = m["wm-target"] || "";
    const target = rawTarget.replace(/\/$/, "") || normalizedSiteUrl;
    if (!grouped[target]) grouped[target] = [];
    grouped[target].push(m);
  }
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([target, mentions]) => ({
      target,
      title: titleMap[target] || target.replace(normalizedSiteUrl, "") || "/",
      mentions
    }));
});
```

This filter:
1. Builds a map of page URLs to titles from the Eleventy collections
2. Filters for only `mention-of` type webmentions (excluding likes, reposts, replies)
3. Excludes self-mentions
4. Groups mentions by their target URL
5. Returns an array of groups with the target URL, page title, and list of mentions

The result is grouped by which page on my site was mentioned, so I can see at a glance which posts are getting the most attention from around the web.

## Microformats: Making Your Content Discoverable

For webmentions to work properly, your pages need [microformats2](https://microformats.org/wiki/microformats2) markup. This is what lets webmention.io parse your pages and extract structured data like author names, content, and publication dates.

This uses the class `h-entry`, which marks an entry (like a blog post or note). Inside that, you use property classes like `p-name` (plain-text name), `e-content` (HTML content), `dt-published` (datetime published), and so on.

Here's what my post template looks like:

```html
<article class="h-entry">
  <header class="post-header">
    <h1 class="p-name">{{ title }}</h1>
    <div class="post-meta">
      <div class="post-meta-item p-author h-card">
        <a class="u-url p-name" rel="author" href="{{ external_url or site.url }}">
          {{ author or site.author.name }}
        </a>
        <img class="u-photo" 
             src="{{ site.author.photo }}" 
             alt="{{ site.author.name }}" 
             style="display:none;">
      </div>
      <time class="dt-published" datetime="{{ date | isoDate }}">
        {{ date | readableDate }}
      </time>
    </div>
  </header>
  <div class="e-content">
    {{ content | safe }}
  </div>
  <footer class="post-footer">
    <a class="u-url" href="{{ site.url }}{{ page.url }}" style="display:none;">
      Permalink
    </a>
    <a class="u-uid" href="{{ site.url }}{{ page.url }}" style="display:none;">
      {{ site.url }}{{ page.url }}
    </a>
  </footer>
</article>
```

The prefix letters matter:
- `p-` is for plain-text properties
- `e-` is for HTML/encoded content
- `u-` is for URLs
- `dt-` is for datetime properties

I also use `u-in-reply-to` for reply posts (linking to the original post I'm replying to) and `u-syndication` for links to syndicated copies (like when I cross-post to Mastodon).

## Sending Webmentions

So far I've talked about receiving webmentions. But the protocol works both ways, and you can also send them when you link to other sites.

The process is:
1. When you publish a post with links, your software discovers the webmention endpoint for each link
2. It sends a POST request to that endpoint with `source` (your URL) and `target` (their URL)
3. Their server validates that your page actually links to them
4. If everything checks out, they accept the mention

### How My Site Sends Webmentions

For my site, I use [Bridgy](https://brid.gy/) to handle the sending side of things. Bridgy is an open-source service that implements POSSE (Publishing on your Own Site, Syndicating Elsewhere) as a service.

Here's how it works for me:

1. **Cross-posting**: When I publish a new post, Bridgy monitors my RSS feed and automatically cross-posts it to connected platforms like Mastodon and Bluesky
2. **Backfeed**: When people interact with those cross-posts (likes, reposts, replies), Bridgy sends webmentions back to my site
3. **Discovery**: When I link to other sites in my posts, Bridgy can discover their webmention endpoints and send mentions on my behalf

The flow looks like this:
- I publish a post on brennan.day
- Bridgy discovers it via my RSS feed
- Bridgy posts it to Mastodon/Bluesky
- Someone likes or replies on Mastodon
- Bridgy sends a webmention to my site with that interaction
- The interaction shows up in my webmentions section

This is the magic of the IndieWeb, really. I own my content, I can syndicate it wherever I want, and all the interactions flow back to my canonical source.

For static sites that don't want to use a service like Bridgy, there are other options:
- Using a build-time tool that sends webmentions after each deploy
- Manually sending webmentions via curl for testing

Here's what a manual webmention looks like with curl:

```bash
curl -X POST https://webmention.io/example.com/webmention \
  -d "source=https://your-site.com/your-post" \
  -d "target=https://example.com/their-post"
```

Aaron Parecki has a great walkthrough called [Sending your First Webmention from Scratch](https://aaronparecki.com/2018/06/30/11/your-first-webmention) if you want to dive deeper into the sending side.

## Testing Your Implementation

If you want to test to make sure everything is working, [webmention.rocks](https://webmention.rocks/) is a great test suite that will send you test webmentions with various markup and tell you if your receiver is handling them correctly.

## Additional Notes

As I already mentioned, if you're using webmention.io's API, cache aggressively to avoid hitting it every time you locally build during testing and development. 

Also, not every webmention will include an author photo, so handle missing data gracefully.

When I link to my own posts in footers or related posts sections, those are filtered out so they don't show up as webmentions. I filter out any mention where the source URL starts with my own domain.

Finally, good microformats markup is what makes webmentions actually useful. Without proper `h-entry` markup, webmention.io can't extract author info or content, and your mentions will look broken.

## Related IndieWeb Pieces

Webmentions don't exist in isolation on my site. They work alongside other IndieWeb building blocks:

- **[Microformats](https://microformats.org/wiki/microformats2)**: Structured data for content discovery
- **[IndieAuth](https://indieauth.net/)**: Authentication for posting and verification (I use this for my comment system)
- **[Micropub](https://micropub.net/)**: API for creating posts (I have an endpoint at `/micropub`)
- **[POSSE](https://indieweb.org/POSSE)**: Publishing on your Own Site, Syndicating Elsewhere.

If you're having any trouble implementing any of this, the IndieWeb community is incredibly welcoming. Don't be afraid to ask questions in [their IRC](https://indieweb.org/discuss) or check the [wiki](https://indieweb.org) when you get stuck.

---

Do you have webmentions on your site? Let me know... through webmentions!



---
title: "How Webmentions Work"
date: 2026-06-20
description: "A walkthrough of implementing webmentions on a static site, from setup to display, including webmention.io integration, Eleventy filters, and CSS styling."
postType: article
tags: ["indieweb", "webmentions", "eleventy", "microformats"]
featured_image: /assets/images/posts/webmentions-setup.jpg
featured_image_alt: "Hand-colored 19th-century political cartoon (labeled 'N° 1') satirizing the Catholic Emancipation debate in Ireland/Britain. A crowded room of men in formal coats and a few barristers in robes sit and stand around tables, gesturing animatedly. Eleven numbered speech balloons rise above the group, debating a 'cat let out of the bag' metaphor for a doctor's (likely a Catholic Board spokesman's) admission about an oath against subverting the Protestant Church, with characters worrying that 'Orangemen' will seize on the remark and invoking memories of 1798. In the upper right corner stands a harp topped with a cross beside a 'Senatorial Catholic Board' placard. At far right, a well-dressed man sits in a red armchair holding a scroll labeled with a list of penal laws against Protestants. At far left, on an elevated wooden platform, two onlookers labeled 'Orange Boven' watch the scene and comment from above."
featured_image_caption: "Thomas Dromgoole speaking at a meeting of the Catholic Board in Dublin; represented as Doctor Drum 'letting the cat out of the bag'. Coloured etching, 1813. | [Wellcome Collection](https://wellcomecollection.org/works/dhdwjkae/images?id=jgennxqh) (edited by the Author)"
---

This guide walks through implementing webmentions on a static site, from setup to display. Webmentions enable notifications across websites and are a W3C Recommendation. If somebody links to your content from their own site, their server can send a webmention to your endpoint, allowing you to receive and display likes, reposts, replies, and mentions.

## What Are Webmentions, Anyways?

Good question. Webmentions enable notifications across websites, and are a [W3C Recommendation](https://www.w3.org/TR/2017/REC-webmention-20170112/). 

If somebody links to your content from their own site, then the server involved can send a webmention to your endpoint, which allows you to both receive and display likes, reposts, replies and mentions. You can think of it being similar to the functionality of various social media platforms, but decentralized.

For example, when Alice writes a post on her blog and Bob writes a response (linking back to Alice), Bob's publishing software will send a webmention to Alice notifying her that her article was replied to, and Alice's software can show the reply as a comment on the original post. And Bob and Alice can be using whatever web tech they feel like to make it happen!

## Webmention.io for Static Sites

Static sites can't receive real-time webmention POST requests, as there's no running server to handle them. When someone sends a webmention, there's nothing there to catch it.

[webmention.io](https://webmention.io/) acts as an intermediary. It's a hosted service that handles receiving webmentions on behalf of your site. The flow is:

1. Other sites send webmentions to your webmention.io endpoint
2. webmention.io validates the mention (checking that the source actually links to the target)
3. webmention.io parses the microformats on the source page to extract author info, content, etc.
4. During your Eleventy build, you fetch all mentions from webmention.io's API
5. The mentions are baked into the static HTML as it's generated

The mentions only appear whenever the site rebuilds, rather than in real-time, but rebuilding daily works fine for most personal sites.

## Setting Up webmention.io

First, sign up at [webmention.io](https://webmention.io/). It's free and open-source. Once you've signed in and verified your domain, you'll get an API token. Like with all API tokens, keep this secret! It's what lets you fetch your mentions.

I store the token as an environment variable:

```bash
# In .env
WEBMENTION_IO_TOKEN=your_token_here
```

Never commit this to git. Add .env to your .gitignore if you haven't already.

## Declaring Your Endpoint

For other sites to know where to send webmentions, you need to declare your endpoint in your HTML head. In your `src/_includes/partials/head.njk`:

{% raw %}```html
<link rel="webmention" href="{{ site.webmention.endpoint }}">
```
{% endraw %}

This tells webmention senders where to send notifications. The spec supports three methods of discovery: HTTP Link headers, `<link>` elements, and `<a>` elements. The `<link rel="webmention">` in the head is the most common.

## Fetching Mentions During Build

This starter includes a data file at `src/_data/webmentions.js` that Eleventy runs during the build:

{% raw %}```javascript
import EleventyFetch from "@11ty/eleventy-fetch";
import site from "./site.js";

export default async function () {
  if (!site.webmention.enabled || !site.webmention.token) return [];

  const url = `${site.webmention.fetchApiBase}?target=${site.url}&token=${site.webmention.token}`;
  const data = await EleventyFetch(url, { duration: "12h", type: "json" });
  return data.children ?? [];
};
```
{% endraw %}

This uses [Eleventy Fetch](https://www.11ty.dev/docs/plugins/fetch/) to cache network requests locally. The `duration: "12h"` means the response is cached for twelve hours, so you can rebuild locally without hitting the API on every build.

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

Raw webmention data isn't very useful on its own. You need to filter it down to what's relevant for each page. This starter includes filters in `config/filters.js` that handle this.

### Getting Mentions for a Specific URL

The `webmentionsForUrl` filter filters all mentions to find only those targeting the current page:

```javascript
eleventyConfig.addFilter("webmentionsForUrl", (webmentions, url) => {
  if (!Array.isArray(webmentions)) return [];
  return webmentions.filter((entry) => entry["wm-target"] === url);
});
```

In templates, use it like this:

{% raw %}```njk
{% set mentions = webmentions | webmentionsForUrl(site.url + page.url) %}
```
{% endraw %}

### Grouping by Type

Not all mentions are the same. Someone might like your post, repost it, reply to it, or just mention it in passing. The `webmentionsByType` filter handles this:

```javascript
eleventyConfig.addFilter("webmentionsByType", (mentions, type) => {
  if (!Array.isArray(mentions)) return [];
  return mentions.filter((entry) => entry["wm-property"] === type);
});
```

The types worth knowing:
- `like-of` - Someone bookmarked or liked the content
- `repost-of` - Someone shared or reposted the content
- `in-reply-to` - Someone replied to the content
- `mention-of` - General mention of the content

In templates, split them out:

{% raw %}```njk
{% set likes = mentions | webmentionsByType("like-of") %}
{% set reposts = mentions | webmentionsByType("repost-of") %}
{% set replies = mentions | webmentionsByType("in-reply-to") %}
```
{% endraw %}

## Displaying Mentions

This starter displays webmentions in `src/_includes/partials/webmentions.njk`. The template shows likes, reposts, and replies as cards with author information and content.

The CSS for styling webmentions is in `src/assets/css/11-webmentions.css`. It handles avatar grouping, reply cards, and responsive layout.

## Microformats: Making Your Content Discoverable

For webmentions to work properly, your pages need [microformats2](https://microformats.org/wiki/microformats2) markup. This is what lets webmention.io parse your pages and extract structured data like author names, content, and publication dates.

This starter uses the class `h-entry` for posts, with property classes like `p-name` (plain-text name), `e-content` (HTML content), `dt-published` (datetime published), and so on. The post layout in `src/_includes/layouts/post.njk` includes these microformats automatically.

The prefix letters matter:
- `p-` is for plain-text properties
- `e-` is for HTML/encoded content
- `u-` is for URLs
- `dt-` is for datetime properties

## Sending Webmentions

The protocol works both ways—you can also send webmentions when you link to other sites. The process is:

1. When you publish a post with links, your software discovers the webmention endpoint for each link
2. It sends a POST request to that endpoint with `source` (your URL) and `target` (their URL)
3. Their server validates that your page actually links to them
4. If everything checks out, they accept the mention

### Using Bridgy for Sending

[Bridgy](https://brid.gy/) is an open-source service that can handle the sending side of webmentions for you. It implements POSSE (Publishing on your Own Site, Syndicating Elsewhere) as a service.

The flow with Bridgy:
- When you publish a post, Bridgy can discover it via your RSS feed
- Bridgy can cross-post to connected platforms like Mastodon and Bluesky
- When people interact with those cross-posts (likes, reposts, replies), Bridgy sends webmentions back to your site
- When you link to other sites in your posts, Bridgy can discover their webmention endpoints and send mentions on your behalf

This starter includes the `<link rel="webmention">` tag in `src/_includes/partials/head.njk` for receiving. For sending, you can use Bridgy or implement the sending logic yourself.

For a detailed walkthrough of how webmentions work in practice, see [this guide on webmentions](https://brennan.day/how-webmentions-work-on-brennan-day/).
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



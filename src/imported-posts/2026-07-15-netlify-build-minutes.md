---
title: "300 Minutes a Month: Cutting My Eleventy Netlify Build Time in Half"
date: 2026-07-15T20:00:00-06:00
tags: [eleventy, javascript, netlify, technical, tutorial]
summary: "A sequel to my Eleventy build post: this time the bottleneck wasn't the build tool, it was the hosting bill. Notes on caching webmentions and guestbook fetches, killing a dead Discord webhook, nearly breaking my JSON feed, and a git error I still don't have an answer for."
description: "A sequel to my Eleventy build post: this time the bottleneck wasn't the build tool, it was the hosting bill. Notes on caching webmentions and guestbook fetches, killing a dead Discord webhook, nearly breaking my JSON feed, and a git error I still don't have an answer for."
featured_image: /assets/images/blog/clock.jpg
atproto_image: assets/images/atproto/clock.jpg
featured_image_alt: "Victorian-style chromolithograph advertisement featuring an oversized ornate gold pocket watch with a white face, black Roman numerals, and a small seconds subdial, the hands pointing to just past twelve. Four cherubs surround the watch: one on the left trails a long red ribbon, one perches on the upper right rim, and two more recline together at the base draped in red fabric among ivy and roses. Ivy vines drape over the watch's crown, and four dark shield-shaped badges around the rim read 'Fine Diamonds,' 'Reliable Watches,' 'Artistic Jewelry,' and 'Standard Silverware.' The scene sits against a teal, cloud-streaked sky, with 'Aston & Hall Sc.' credited in the lower right corner."
featured_image_caption: "'Fine diamonds, reliable watches, artistic jewelry, standard silverware' by Aston & Hall sc. 1880. Original public domain image from the Library of Congress. | [Flickr](https://www.rawpixel.com/image/8627093/image-art-vintage-golden) (edited by the Author)"
collection: technical-tutorials
atUri: "at://did:plc:h4fm3emeptzegfs452eoiaz7/site.standard.document/3mqo6zxuv2s2n"
---

A couple of months ago I wrote about [making my Eleventy build five times faster](https://brennan.day/i-made-my-eleventy-build-5-faster-with-five-changes/) by fixing a handful of embarrassing filters. I wrote about developer experience and the feedback loop of "I write a line" and "I see the result." 

Why am I writing a sequel already? Well, the answer is money. Or more accurately, keeping things free.

I'm on [Netlify's legacy free plan](https://www.netlify.com/pricing/faq/), which gives me 300 build minutes a month. Right now, despite my previous optimizations, the build time averages around **2 minutes, 45 seconds**. If I'm committing and building the site once a day (and I usually am more often than that), then I'm getting too close to that free limit.

What can I optimize? The answers are far more Netlify-centric this time around, rather than just about 11ty.

## An Unused Webhook

Before optimizing, I looked for what I could delete outright. The fastest build minute is the one you never spend.

I had a Discord webhook integration, a shell script and a Netlify Function, that pinged a Discord channel whenever I published. Since I'm deleting my Discord and [a bunch of other social media](https://brennan.day/a-full-guide-to-properly-delete-corporate-social-media-accounts/), I no longer need the webhook. The way I wrote the script meant that at each build, it was fetching my RSS feed, sleeping 30 seconds to "allow for deployment," parsing the latest post, and POSTing to the webhook.

```bash
# scripts/discord-webhook-ping.sh (deleted)
sleep 30
LATEST_POST=$(curl -s "$RSS_URL" | ...)
curl -X POST "$DISCORD_WEBHOOK_URL" -d "{ \"embeds\": [...] }"
```

Thirty seconds of `sleep`, plus a network round-trip, on every deploy, for a feature I'd abandoned. I deleted the script, the Netlify Function, and the `DISCORD_WEBHOOK_URL` reference from `.env.example`. 

Dead code should die properly. If I ever want notifications pinging elsewhere, it's a small script to rewrite.

## Uncached Data Fetches

My `src/_data/` directory has a few files that hit external APIs on every single build:

- `statuslog.js`: pulls my [status.lol](https://brennan.omg.lol) updates
- `webmentions.js`: pulls webmentions from [webmention.io](https://webmention.io)
- `guestbook.js`: pulls form submissions from the Netlify API

All three use [`@11ty/eleventy-fetch`](https://www.11ty.dev/docs/plugins/fetch/) for disk caching, but the cache `duration` values were too conservative: 1 hour for statuslog and 6 hours for webmentions and guestbook. My status log updates once a day at most, and guestbook entries trickle in over weeks.

```javascript
// Before: re-fetches every 6 hours, most of which are wasted
const response = await EleventyFetch(url, {
  duration: "6h",
  type: "json"
});
```

```javascript
// After: 24 hours is still fresh enough for a personal blog
const response = await EleventyFetch(url, {
  duration: "24h", // Cache for 24 hours
  type: "json"
});
```

One word changed, three times, across three files. `EleventyFetch`'s `duration` option accepts `s`, `m`, `h`, `d`, `w`, and `y` [shorthand units](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration), and there's even a `duration: "*"` special value if you want to *never* refetch after the first success. 

24 hours instead of 1 or 6 means if I'm deploying multiple times a day (which I often do), then it'll use the disk cache instead of the network.

This didn't show up in Eleventy's own benchmark output (network calls aren't instrumented there the way filters are), but the effect is visible in the deploy log:

```
6:22:42 PM: Fetching status.lol data...
6:22:43 PM: Successfully fetched 108 statuses
6:22:43 PM: Fetched 43 guestbook entries from Netlify
6:22:44 PM: Fetched 1000 webmentions (seems to be a max limit?)
```

Three fetches, all resolved in about two seconds combined, most days served entirely from `.cache/` rather than hitting `omg.lol`, `webmention.io`, and the Netlify API fresh.

## Image Thumbnails

My `thumbnail` shortcode wraps [`eleventy-img`](https://www.11ty.dev/docs/plugins/image/) to generate responsive `<picture>` sources. 

`eleventy-img` already caches its own *output files*, it won't regenerate a resized image if the source hasn't changed, but the metadata object it returns (widths, formats, output paths) was being recomputed in memory on every build, because it wasn't persisting between processes.

```javascript
// Before: in-memory only, recomputed every time the build process starts fresh
const metadata = await Image(fullPath, {
  widths: sizes,
  formats: ["webp"],
  outputDir: "./_site/assets/images/thumbnails/",
  urlPath: "/assets/images/thumbnails/",
  filenameFormat: function(id, src, width, format) {
    const extension = path.extname(src);
    const name = path.basename(src, extension);
    return `${name}-${width}w.${format}`;
  }
});
```

The fix mirrors the pattern from the `lastModified` git cache in my last post: hash the input, check disk before doing the work, write to disk after.

```javascript
const CACHE_DIR = path.join(ROOT_DIR, ".eleventy-cache", "thumbnails");

function getThumbnailCacheKey(fullPath, width) {
  const hash = crypto.createHash("md5").update(fullPath).digest("hex");
  return path.join(CACHE_DIR, `${hash}-${width}.json`);
}

// After: read cached metadata if it exists, only call Image() on a miss
const cacheKey = getThumbnailCacheKey(fullPath, width);
let metadata;

if (fs.existsSync(cacheKey)) {
  try {
    metadata = JSON.parse(fs.readFileSync(cacheKey, "utf8"));
  } catch (e) {
    // Cache invalid, regenerate
  }
}

if (!metadata) {
  metadata = await Image(fullPath, { /* ...same options as before... */ });
  fs.writeFileSync(cacheKey, JSON.stringify(metadata));
}
```

`.eleventy-cache/` then needed to go in `.gitignore` alongside the existing `.cache/` directory that `eleventy-fetch` already uses. Cache files are regenerable garbage and don't belong in version control.

## Incremental Builds

Eleventy 3.x has a `--incremental` flag that I'd just never turned it on for the real build command. It only rebuilds files that changed since the last run, using its own dependency graph.

```json
"build": "eleventy --incremental && npx pagefind --site _site && node scripts/generate-json-feed.js"
```

This mostly matters for local `npm start` sessions where I'm writing and rebuilding in a loop, less so for a from-scratch Netlify build where the `_site` output doesn't exist yet. But it essentially has no downsides, so it can just stay on.

## Netlify Config

Netlify only counts time inside the `build.command` toward your monthly minutes. Anything that runs *after* the site is live, such as [post-deploy hooks](https://docs.netlify.com/build/configure-builds/build-hooks/) and [`onSuccess` / `onEnd` build plugin events](https://www.netlify.com/blog/2021/01/28/post-deploy-events-now-available-to-build-plugins/), does not.

I had a [WebSub](https://websubhub.com/) ping script that notifies subscribers when `feed.xml` updates. It doesn't need to run *before* the deploy is live, it needs to run *after*, so I moved it to a `postDeploy` hook:

```toml
# Post-deploy hooks (run after deploy, don't count toward build minutes)
[[hooks]]
  stage = "postDeploy"
  command = "./scripts/websub-direct-ping.sh"
```

I also bumped `NPM_FLAGS` to include `--prefer-offline`, so npm favours local cache over the registry when a cached version is available:

```toml
[build.environment]
  NPM_FLAGS = "--prefer-offline"
```

## JSON Feed

While I was looking for things to cut, I noticed `scripts/generate-json-feed.js` re-parses every Markdown post's frontmatter and renders it to HTML on every build to produce `feed.json`. That's duplicated from what Eleventy is already doing for `feed.xml`. 

Should I just remove it? Well, [JSON Feed](https://www.jsonfeed.org/) is a niche format, sure. But if any of my subscribers are using it, then the time save would be removing a way for people to access my site and my work.

## A Blob Mystery

After deploying with these changes, the build log had these lines:

```
git@gitlab.com: Permission denied (publickey).
fatal: Could not read from remote repository.
fatal: could not fetch 39c0b80d9ebf944a792f1f8702e3daa9278035f7 from promisor remote
```

My best current understanding, after reading through [Netlify's community forum](https://answers.netlify.com/t/please-confirm-repo-clones-are-not-shallow/86587): Netlify doesn't do a literal `--depth=1` clone by default, it does a **blobless clone** (`git clone --filter=blob:none`), which fetches all commits and trees up front but lazily downloads individual file *blobs* on demand from a "promisor remote," which is the origin fallback when a blob is missing locally.

My `lastModified` filter (the one from the last post's git-log optimization) runs `git log --name-only` across the *entire* history to build its timestamp cache. On a blobless clone, that can trigger a lazy blob fetch for old file versions git doesn't have locally yet, so that fetch goes out over SSH to GitLab, which the Netlify build server has no reason to have credentials for (it authenticates to GitLab through its own integration, not a general-purpose SSH key).

Thankfully nothing downstream actually depends on the historical blob resolving. The `Map.has()` check in my timestamp cache doesn't need it to. I added `GIT_DEPTH = "1"` to `netlify.toml` hoping it would shrink the clone further; given what I've now read, it's likely a no-op on Netlify's infrastructure. 

My open questions for a follow-up post: does `GIT_DEPTH` do anything at all on Netlify's build image? And can I make `getGitTimestampCache()` avoid touching history further back than `.cache/git-timestamps.json`? Then, it would never require a blob that isn't already local.

If anyone cracks the blobless-clone-vs-git-log-history question on Netlify, I'd love to know. $20 CAD bounty, even.

## The Numbers

Before this round of changes, my Netlify builds were averaging around 2 minutes 45 seconds. The build after all of the above:

```
6:22:36 PM: Starting build script
...
6:23:25 PM: (build.command completed in 44.3s)
...
6:23:42 PM: (Netlify Build completed in 1m 3.5s)
6:23:46 PM: Finished processing build request in 1m22.373s
```

| Stage | Time |
|---|---|
| `npm run build` (Eleventy + Pagefind + JSON feed) | 44.3s |
| Full Netlify Build step | 1m 3.5s |
| Total deploy (build + functions + upload) | 1m 37s |

Roughly **halved**, from a mix of caching that actually mattered (the API fetches, the thumbnail metadata) and cutting dead weight that didn't need to run at all (the Discord webhook, the WebSub ping moved out of the build window). The same lesson as [last time](https://brennan.day/i-made-my-eleventy-build-5-faster-with-five-changes/), just applied to the Netlify job, rather than just 11ty.


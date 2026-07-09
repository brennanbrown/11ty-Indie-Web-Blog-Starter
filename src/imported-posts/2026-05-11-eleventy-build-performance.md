---
title: "I Made My Eleventy Build 5× Faster with Five Changes"
date: 2026-05-11T00:00:00-07:00
tags: [eleventy, javascript, technical, tutorial, IndieWeb, "personal site"]
summary: "A walkthrough of how I audited my 11ty build benchmarks and cut cold-start time from 14 seconds down to 2.6 seconds by caching two custom filters and swapping out a bare network fetch."
description: "A walkthrough of how I audited my 11ty build benchmarks and cut cold-start time from 14 seconds down to 2.6 seconds by caching two custom filters and swapping out a bare network fetch."
featured_image: /assets/images/blog/horses.jpg
atproto_image: assets/images/atproto/horses.jpg
featured_image_alt: "Three jockeys race side by side on horseback in a flat racing scene rendered in a bold graphic illustration style. The horses—one dark, one white, one dark bay—surge forward at full gallop against a vivid coral-red background. The jockeys lean low over their mounts' necks, dressed in racing silks and caps. The palette is limited to deep teal-black, white, gold, and red, the image has the feel of a vintage screen-print/linocut poster."
featured_image_caption: "'The Runners' (1900), vintage horse racing illustration. Original from Library of Congress | [Rawpixel](https://www.rawpixel.com/image/8627614/image-art-vintage-public-domain) (edited by the Author)"
collection: technical-tutorials
atUri: "at://did:plc:h4fm3emeptzegfs452eoiaz7/site.standard.document/3mqaajjfv7r27"
---

A few months ago, I worked on [improving the performance of my website](https://brennan.day/from-65-to-83-attempts-at-performance-optimization/) for end-users and visitors. But I've also come to realize I needed to look at the build and rendering of the site, as the initial boot of my dev server (and production server) has become absurdly sluggish. I'd run `npm start`, brew coffee in my Chemex, come back, and it'd *just* be finishing. I told myself it's no big deal, nobody sees it except me and it's only the startup. With my blog already at over 180 posts, I figured it was just something I'd need to accept. Incremental builds are fast so I just suffered through it.

The thing is though, the fixes were embarrassingly simple once I actually looked at what was happening. Come explore my novice computer science skills with me! :D

Eleventy prints benchmark data at the end of every build if anything is slow enough to measure. I'd often just skim past it. This time I paid attention:

```
[11ty] Benchmark   8937ms  64%   222× (Configuration) "lastModified" Nunjucks Filter
[11ty] Copied 286 Wrote 413 files in 13.99 seconds
```

Eight and a half seconds on a single filter! Out of fourteen total.

## The Culprit: `lastModified`

I have a filter that displays "last modified" dates on posts and pages, using `git log` to pull the most recent commit timestamp for each source file. I think it's important to inform readers when content was  updated, not just published.

The problem is how it was implemented:

```javascript
// Before: spawns a git subprocess for every single page
eleventyConfig.addFilter("lastModified", (filePath) => {
  const result = execSync(`git log -1 --format=%at "${filePath}"`).toString().trim();
  if (result) {
    const timestamp = parseInt(result, 10);
    return DateTime.fromSeconds(timestamp, { zone: "America/Edmonton" })
      .toFormat("MMMM d, yyyy");
  }
});
```

At 222 pages, this spawns **222 separate `git` processes**, each with its own startup overhead. Process spawning in Node.js is not free. It adds up fast.

The fix: run `git log` *once* at startup with `--name-only` to get all file timestamps in a single pass, store the results in a `Map`, and just do a lookup in the filter.

```javascript
// After: one git process at startup w/ 222 Map lookups
let _gitTimestampCache = null;
function getGitTimestampCache() {
  if (_gitTimestampCache !== null) return _gitTimestampCache;
  _gitTimestampCache = new Map();
  const output = execSync(
    'git log --format="%at" --name-only',
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  );
  let currentTimestamp = null;
  for (const line of output.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\d{9,11}$/.test(trimmed)) {
      currentTimestamp = parseInt(trimmed, 10);
    } else if (currentTimestamp !== null && !_gitTimestampCache.has(trimmed)) {
      // git log is newest-first, so first occurrence = most recent commit
      _gitTimestampCache.set(trimmed, currentTimestamp);
    }
  }
  return _gitTimestampCache;
}

const _lastModifiedResultCache = new Map();
eleventyConfig.addFilter("lastModified", (filePath) => {
  if (_lastModifiedResultCache.has(filePath)) return _lastModifiedResultCache.get(filePath);
  const normalizedPath = filePath.replace(/^\.?\//, '');
  const cache = getGitTimestampCache();
  let result = null;
  if (cache.has(normalizedPath)) {
    const timestamp = cache.get(normalizedPath);
    result = DateTime.fromSeconds(timestamp, { zone: "America/Edmonton" })
      .toFormat("MMMM d, yyyy");
  } else {
    const stats = fs.statSync(filePath);
    result = DateTime.fromJSDate(stats.mtime, { zone: "America/Edmonton" })
      .toFormat("MMMM d, yyyy");
  }
  _lastModifiedResultCache.set(filePath, result);
  return result;
});
```

`git log --name-only` streams every commit with all the files it touched. Since git outputs commits newest-first, the very first time a file path appears in that stream is its most recent modification date. The `Map.has()` check ensures we don't overwrite it with an older timestamp.

After this change: **13.99s → 4.35s**.

## Second Pass: `assetHash`

With `lastModified` out of the way, the next benchmark that appeared was:

```
[11ty] Benchmark    439ms  10% 11891× (Configuration) "assetHash" Nunjucks Filter
```

Eleven thousand, eight hundred and ninety-one calls. For a filter that reads a file from disk and computes an MD5 hash. I have maybe ten asset files.

The filter is used for cache-busting, appending a `?v=<hash>` query string to CSS and JS paths. It's called from `base.njk` which renders for *every* page, and base.njk references the same five or six asset paths every time. So the same files were being read and hashed ~28 times per page.

```javascript
// Before: reads from disk on every call
eleventyConfig.addFilter("assetHash", (assetPath) => {
  const fullPath = path.join(__dirname, 'src', assetPath);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const hash = crypto.createHash('md5').update(fileContents).digest('hex').substring(0, 8);
    return `${assetPath}?v=${hash}`;
  }
  return assetPath;
});
```

```javascript
// After: one read per unique path
const _assetHashCache = new Map();
eleventyConfig.addFilter("assetHash", (assetPath) => {
  if (_assetHashCache.has(assetPath)) return _assetHashCache.get(assetPath);
  const fullPath = path.join(__dirname, 'src', assetPath);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const hash = crypto.createHash('md5').update(fileContents).digest('hex').substring(0, 8);
    const result = `${assetPath}?v=${hash}`;
    _assetHashCache.set(assetPath, result);
    return result;
  }
  return assetPath;
});
```

Two lines added. `assetHash` disappeared from the benchmarks entirely after this.

## Third Pass: Uncached Network Fetch

The third issue was less obvious. After the first two fixes, this appeared:

```
[11ty] Benchmark    523ms  13%     1× (Data) `./src/_data/guestbook.js`
```

Only called once, but still 523ms—a live HTTP round-trip to the Netlify API on every build. My `guestbook.js` data file was using raw `node-fetch` with no caching, no retry, and no persistence between builds.

My `webmentions.js` already does this correctly with [`@11ty/eleventy-fetch`](https://www.11ty.dev/docs/plugins/fetch/), which caches responses to disk for a configurable duration. I just hadn't applied the same pattern to guestbook data.

```javascript
// Before: raw fetch, live request every build
const fetch = require("node-fetch");

const formsResponse = await fetch(formsUrl, { headers: { "Authorization": `Bearer ${token}` } });
const forms = await formsResponse.json();

const submissionsResponse = await fetch(submissionsUrl, { headers: { "Authorization": `Bearer ${token}` } });
const submissions = await submissionsResponse.json();
```

```javascript
// After: EleventyFetch with 1h disk cache
const EleventyFetch = require("@11ty/eleventy-fetch");

const fetchOptions = { headers: { "Authorization": `Bearer ${token}`, "User-Agent": "curl/7.79.1" } };

const forms = await EleventyFetch(formsUrl, { duration: "1h", type: "json", fetchOptions });
const submissions = await EleventyFetch(submissionsUrl, { duration: "1h", type: "json", fetchOptions });
```

The result is cached to `.cache/` for an hour. Subsequent builds within that window skip the network.

## Fourth Pass: A Disk Cache for `git log`

After running the benchmarks again, `lastModified` was still showing at ~450ms per cold start. The single-process fix cut spawning from 222 to 1, but that one `git log --name-only` call still runs on every fresh Node.js process — every `npm start`, every CI build.

```
[11ty] Benchmark    449ms  11%   223× (Configuration) "lastModified" Nunjucks Filter
```

The fix was to persist the timestamp map to `.cache/git-timestamps.json`, keyed by `git rev-parse HEAD`. If HEAD matches, then the git log is skipped entirely and just the JSON is read.

```javascript
// Before: in-memory only, runs git log on every cold start
let _gitTimestampCache = null;
function getGitTimestampCache() {
  if (_gitTimestampCache !== null) return _gitTimestampCache;
  _gitTimestampCache = new Map();
  const output = execSync(
    'git log --format="%at" --name-only',
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  );
  // ...parse output into map
  return _gitTimestampCache;
}
```

```javascript
// After: disk-cached, keyed by HEAD SHA
const cacheFile = path.join(__dirname, '.cache', 'git-timestamps.json');
const currentHead = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

if (fs.existsSync(cacheFile)) {
  const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  if (cached.head === currentHead) {
    for (const [k, v] of Object.entries(cached.timestamps)) {
      _gitTimestampCache.set(k, v);
    }
    return _gitTimestampCache; // no subprocess at all
  }
}

// ...run git log as before, then persist:
fs.mkdirSync(path.join(__dirname, '.cache'), { recursive: true });
fs.writeFileSync(cacheFile, JSON.stringify({
  head: currentHead,
  timestamps: Object.fromEntries(_gitTimestampCache)
}));
```

`lastModified` dropped off the benchmarks entirely on the next build. The `.cache/` directory is already used by `@11ty/eleventy-fetch`, so no extra gitignore entry needed.

## Fifth Pass: 54 Warnings From Old Medium Posts

Running the dry-run build was also flooding the console:

```
Image not found: /Users/brennan/.../src/https:/cdn-images-1.medium.com/max/1200/1*...png
```

Old posts imported from Medium have absolute CDN URLs in their frontmatter. These were being passed to my `thumbnail` shortcode, which calls `fs.existsSync` on a nonsense path like `src/https:/...` before bailing.

```javascript
// Before: passes external URLs straight to fs.existsSync
const fullPath = path.join(__dirname, 'src', imagePath);
if (!fs.existsSync(fullPath)) {
  console.warn(`Image not found: ${fullPath}`);
  return `<img src="${imagePath}" alt="${alt}" ...>`;
}
```

Two lines ahead of that check fixes it:

```javascript
// After: bail before touching the filesystem for external URLs
if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
  const fetchpriorityAttr = fetchpriority ? ` fetchpriority="${fetchpriority}"` : '';
  return `<img src="${imagePath}" alt="${alt}" width="${width}" height="${height}" loading="${loading}"${fetchpriorityAttr}>`;
}
```

Zero warnings. As a bonus, external images now correctly receive the `fetchpriority` attribute instead of silently stripping it.

## What Didn't Help: `slugify` Memoization

`slugify` was sitting at ~638ms for 1,851 calls, another candidate for memoization:

```javascript
const _slugifyCache = new Map();
const _origSlugify = eleventyConfig.getFilter("slugify");
eleventyConfig.addFilter("slugify", (str, opts) => {
  const key = str + (opts ? JSON.stringify(opts) : '');
  if (_slugifyCache.has(key)) return _slugifyCache.get(key);
  const result = _origSlugify(str, opts);
  _slugifyCache.set(key, result);
  return result;
});
```

Before: 638ms. After: 645ms. The 1,851 calls are almost entirely unique strings of post titles, heading anchors, and tag names computed fresh per page. The hit rate is near zero. The wrapper stays since it costs nothing, but it isn't a meaningful win today.

## One More Line Each: Longer Cache Durations

`webmentions.js` and `guestbook.js` were both using `"1h"` EleventyFetch durations. Neither service updates hourly. Bumped to `"6h"`.

## Final Numbers

| Build | Time | Notes |
|---|---|---|
| Before | 13.99s | `lastModified` consuming 64% of build |
| Fix 1 | 4.35s | Single `git log` + Map cache |
| Fix 2 | 4.13s | `assetHash` memoized |
| Fix 3 | 4.00s  | `guestbook` on EleventyFetch |
| Fix 4 (cold) | 3.28s | git-timestamps.json written to disk |
| Fix 4 (warm) | **2.63s** | `lastModified` off benchmarks; site has grown since Fix 3 |

**81% faster cold-start. 5.3× overall speedup.** The remaining time on the warm build is `html-transformer` (~580ms) and `slugify` (~640ms) which are both built-in. The `lastModified` git log cost is now effectively free on repeated cold starts once the disk cache is populated.

## Bonus: `netlify dev`

While I was at it, I added a `[dev]` section to `netlify.toml` to make the Netlify CLI actually useful for local prod-like testing. Without it, `netlify dev` tries to auto-detect the framework and usually guesses wrong.

```toml
[dev]
  command = "npm start"
  targetPort = 8081
  port = 8888
  autoLaunch = false
```

Now `npm run start:netlify` spins up a local server at `http://localhost:8888` with all the Netlify Functions, redirects, and custom headers from `netlify.toml` active — so you can test things like the micropub endpoint and comment function without deploying first.

## On Developer Experience (DX)

I've often tried to optimize and add accessibility for end-users.  I've concerned myself with Lighthouse scores, asset compression, etc. But what I've been describing in this post is  something I hadn't thought to name before I started digging into it.

It's called [developer experience](https://getdx.com/blog/developer-experience/), or DX! Not UX for users, but UX for the developer themselves. Everything that shapes the building. Tools, feedback loops, the environment you code in, and certainly how long you wait during build times. I came through this through my benchmarks without really knowing that's what I was doing.

Developer experiencedeals with [three interconnected dimensions](https://queue.acm.org/detail.cfm?id=3595878): **feedback loops**, **cognitive load**, and **flow state**. 

- **Feedback loops** are the speed at which your environment responds to what you do. Write a line, see the result. Change a filter, rebuild the page. Every development session is a chain of micro-cycles. When the loop is less than a second, you stay in the work. When it drags, you [lose the thread](https://microservices.io/post/architecture/2025/02/23/the-importance-of-flow.html). The 14-second cold start I've accumulated had trained me to physically leave my desk during startup to make coffee! The loop broke and I ritualized the breakage.
* **Cognitive load** is the mental overhead of your environment, which is everything your brain is spending cycles on besides the actual problem. The 54 console warnings from those Medium import URLs were a great example. I'd been skimming past them for months. Every build gad a scroll noise, and that noise pulled at my attention. The fix was two lines. A clean terminal is a lower-overhead terminal.
* **Flow state** is what becomes possible when the other two are healthy. The Csikszentmihalyi's term, the absorbed, frictionless attention. Tools disappears and the work is all there is. For a personal site, on a solo project, flow is the entire point, isn't it? I'm not shipping to stakeholders. Nobody is waiting on a PR. The reason I maintain this or any of my other projects is just the pleasure of the craft, and a poor DX is antithetical to that.

Build speed, for a personal site, the one I use as for my daily writing practice, is important to be mindful of. The optimizations I made didn't change anything visible to a reader. 

The `netlify dev` configuration also helps in a similar way, allowing me to test micropub endpoints and edge functions before deploying. The doubt is gone.

DX, like UX, is something I'll be tinkering with indefinitely. My benchmarks will become slower again as I write more posts and add more functionality. New filters, new data sources, new complexity. I'm so excited to learn more about this 

---

Like the rest of my code, all of these changes are available to see in my [site's source on GitLab](https://gitlab.com/brennankbrown/brennan.day). The pattern is **measure first, then cache aggressively**. Eleventy's built-in benchmarks tell you exactly where to look — and when you think you've found everything, run them again. RTFM! :D

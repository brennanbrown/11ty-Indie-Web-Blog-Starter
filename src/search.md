---
title: Search
---

<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>

<div class="search-container">
  <div id="search"></div>
</div>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({
      element: "#search",
      showSubResults: true,
      showImages: false,
      excerptLength: 30,
      filter: {},
      processResult: function(result) {
        // Boost posts in results
        if (result.url.includes('/posts/')) {
          result.meta.score = (result.meta.score || 0) * 1.5;
        }
        return result;
      }
    });
  });
</script>

<noscript>
  <p>Search requires JavaScript. In the meantime, browse the <a href="/posts/">full post archive</a>.</p>
</noscript>

<hr>

<p>This starter ships a build-time, no-server search using
<a href="https://pagefind.app/">Pagefind</a>. It indexes your built site
and needs no hosted infrastructure or API credentials.</p>

<p>Want hosted search instead (e.g. Elasticsearch)? That trades this
simplicity for real infrastructure: a running server, API credentials, and
usually a serverless function to keep the key off the client. See
`README.md` for the tradeoffs and how to wire it up.</p>

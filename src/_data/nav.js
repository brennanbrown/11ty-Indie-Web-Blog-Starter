// src/_data/nav.js
//
// Drives the site nav. Nothing about page order or labels is hardcoded
// in partials/nav.njk. Adding a new slash page is: create the Markdown
// file, add one entry here.

export default [
  { title: "Home", url: "/", order: 1, icon: "fa-house" },
  { title: "Posts", url: "/posts/", order: 2, icon: "fa-file-lines" },
  { title: "About", url: "/about/", order: 3, icon: "fa-user" },
  { title: "Contact", url: "/contact/", order: 4, icon: "fa-envelope" },
  { title: "Guestbook", url: "/guestbook/", order: 5, icon: "fa-book-open" },
  { title: "Search", url: "/search/", order: 6, icon: "fa-magnifying-glass" }
];

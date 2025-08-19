---
layout: layouts/post.njk
title: Weekend Project - Building a Reading List App
subtitle: Sometimes the best solutions are the simple ones
author: Blog Author
date: 2025-08-05
description: How I built a minimal reading list tracker in a weekend using vanilla JavaScript and local storage.
tags: [projects, javascript, productivity, weekend]
featuredImage: https://picsum.photos/800/400?random=5
category: projects
---

I've been meaning to organize my reading list for months. Bookmarks scattered across browsers, articles saved in various apps, and that growing pile of "I'll read this later" links. This weekend, I finally did something about it.

## The Problem

My reading workflow was broken:
- Browser bookmarks became digital hoarding
- Read-later apps felt too heavy for simple link saving  
- No easy way to track what I'd actually finished
- Switching between devices meant losing context

## The Solution

Instead of researching the "perfect" app, I spent Saturday morning building exactly what I needed:

```javascript
// Simple reading list structure
const readingList = {
  items: [],
  
  add(url, title, tags = []) {
    const item = {
      id: Date.now(),
      url,
      title,
      tags,
      added: new Date(),
      status: 'unread'
    };
    this.items.push(item);
    this.save();
  },
  
  markRead(id) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.status = 'read';
      item.completed = new Date();
      this.save();
    }
  }
};
```

## Key Features

**Local Storage First**: Everything stays on my device. No accounts, no sync issues, no privacy concerns.

**Minimal Interface**: Add link, mark as read, filter by tags. That's it.

**Keyboard Shortcuts**: `Cmd+K` to add, `Space` to mark read, `F` to filter.

**Export Ready**: JSON export means I can migrate later if needed.

![Reading list interface](https://picsum.photos/600/300?random=6 "Clean, minimal reading list interface")

## What I Learned

**Vanilla JavaScript is powerful**: No framework needed for this. DOM manipulation, local storage, and event handling covered everything.

**Constraints breed creativity**: Limiting myself to weekend scope forced focus on core features.

**Perfect is the enemy of done**: My half-finished research into existing solutions was blocking progress.

## The Code

The entire app is ~200 lines of HTML, CSS, and JavaScript. Here's the core functionality:

```html
<div class="reading-list">
  <form id="add-form">
    <input type="url" placeholder="Paste URL here..." required>
    <input type="text" placeholder="Tags (optional)">
    <button type="submit">Add</button>
  </form>
  
  <div class="filters">
    <button data-filter="all">All</button>
    <button data-filter="unread">Unread</button>
    <button data-filter="read">Read</button>
  </div>
  
  <ul id="items"></ul>
</div>
```

```css
.reading-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.reading-item.read {
  opacity: 0.6;
  text-decoration: line-through;
}
```

## Results

Two months later, I'm still using it daily. The simplicity that felt like a limitation became its greatest strength. No feature creep, no complexity, just a tool that does exactly what I need.

**Stats so far:**
- 47 articles added
- 31 completed  
- Average reading time: 8 minutes
- Most common tags: `javascript`, `design`, `productivity`

## Lessons for Future Projects

**Start with constraints**: Weekend scope, no external dependencies, single HTML file.

**Solve your own problem first**: Don't build for imaginary users.

**Ship the minimum**: You can always add features later (but you probably won't need to).

The best tools often aren't the most sophisticated ones—they're the ones that get out of your way and let you focus on what matters.

*You can find the complete code in [this GitHub gist](https://gist.github.com/example) if you want to build your own version.*

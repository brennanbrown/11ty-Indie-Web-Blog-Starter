(function() {
  // Webmentions functionality
  async function loadWebmentions() {
    const webmentionsContainer = document.getElementById('webmentions-list');
    if (!webmentionsContainer) return;

    const currentUrl = window.location.href;
    const domain = window.location.hostname;
    
    try {
      // Fetch webmentions from webmention.io
      const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(currentUrl)}&per-page=50`);
      const data = await response.json();
      
      if (data.children && data.children.length > 0) {
        displayWebmentions(data.children, webmentionsContainer);
      } else {
        showEmptyState(webmentionsContainer);
      }
    } catch (error) {
      console.warn('Failed to load webmentions:', error);
      showEmptyState(webmentionsContainer);
    }
  }

  function displayWebmentions(mentions, container) {
    const likes = mentions.filter(m => m['wm-property'] === 'like-of');
    const reposts = mentions.filter(m => m['wm-property'] === 'repost-of');
    const replies = mentions.filter(m => m['wm-property'] === 'in-reply-to');
    const bookmarks = mentions.filter(m => m['wm-property'] === 'bookmark-of');
    const general = mentions.filter(m => m['wm-property'] === 'mention-of');

    let html = '';

    // Show counts
    if (likes.length > 0 || reposts.length > 0 || bookmarks.length > 0) {
      html += '<div class="flex items-center space-x-4 mb-6 text-sm text-gray-600 dark:text-gray-400">';
      if (likes.length > 0) html += `<span>❤️ ${likes.length} like${likes.length !== 1 ? 's' : ''}</span>`;
      if (reposts.length > 0) html += `<span>🔄 ${reposts.length} repost${reposts.length !== 1 ? 's' : ''}</span>`;
      if (bookmarks.length > 0) html += `<span>🔖 ${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}</span>`;
      html += '</div>';
    }

    // Show replies and mentions
    const conversationMentions = [...replies, ...general].sort((a, b) => new Date(a.published) - new Date(b.published));
    
    if (conversationMentions.length > 0) {
      html += '<div class="space-y-4">';
      conversationMentions.forEach(mention => {
        html += renderMention(mention);
      });
      html += '</div>';
    }

    container.innerHTML = html;
  }

  function renderMention(mention) {
    const author = mention.author || {};
    const content = mention.content || {};
    const published = mention.published ? new Date(mention.published).toLocaleDateString() : '';
    
    return `
      <article class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          ${author.photo ? 
            `<img src="${author.photo}" alt="${author.name || 'Anonymous'}" class="w-10 h-10 rounded-full" />` :
            `<div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
               <span class="text-sm font-medium">${(author.name || 'A')[0].toUpperCase()}</span>
             </div>`
          }
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 text-sm">
              <a href="${author.url || '#'}" class="font-medium hover:text-blue-600" target="_blank" rel="noopener">
                ${author.name || 'Anonymous'}
              </a>
              <span class="text-gray-500">
                ${mention['wm-property'] === 'in-reply-to' ? 'replied' : 'mentioned this'}
              </span>
              ${published ? `<time class="text-gray-500">${published}</time>` : ''}
            </div>
            ${content.text ? 
              `<div class="mt-2 text-gray-700 dark:text-gray-300">
                 ${content.text.length > 280 ? content.text.substring(0, 280) + '...' : content.text}
               </div>` : ''
            }
            <div class="mt-2">
              <a href="${mention.url}" class="text-sm text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">
                View original
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function showEmptyState(container) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <p>No webmentions yet. Be the first to respond!</p>
        <p class="text-sm mt-2">
          <a href="https://indieweb.org/Webmention" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800">
            Learn about webmentions
          </a>
        </p>
      </div>
    `;
  }

  // Initialize webmentions when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWebmentions);
  } else {
    loadWebmentions();
  }
})();

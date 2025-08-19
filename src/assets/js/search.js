(function() {
  let searchIndex = null;
  let flexSearch = null;

  // Initialize search when DOM is ready
  document.addEventListener('DOMContentLoaded', initializeSearch);

  async function initializeSearch() {
    const searchInput = document.getElementById('q');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;

    try {
      // FlexSearch should already be loaded via script tag
      if (typeof FlexSearch === 'undefined') {
        throw new Error('FlexSearch library not found. Make sure flexsearch.min.js is loaded.');
      }

      // Load search index
      const response = await fetch('/search.json');
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }
      
      searchIndex = await response.json();
      
      if (!Array.isArray(searchIndex) || searchIndex.length === 0) {
        console.warn('Search index is empty or invalid');
        return;
      }

      // Initialize FlexSearch
      flexSearch = new FlexSearch.Index({
        tokenize: 'forward',
        cache: true,
        resolution: 9
      });

      // Add documents to search index
      searchIndex.forEach((item, index) => {
        if (item && item.title) {
          const searchText = `${item.title} ${item.description || ''} ${item.content || ''} ${(item.tags || []).join(' ')}`;
          flexSearch.add(index, searchText);
        }
      });

      // Set up search event listeners
      setupSearchListeners(searchInput, searchResults);
      
      console.log(`Search initialized with ${searchIndex.length} items`);
      
    } catch (error) {
      console.error('Search initialization failed:', error);
    }
  }

  function setupSearchListeners(searchInput, searchResults) {
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length < 2) {
        hideSearchResults(searchResults);
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query, searchResults);
      }, 300);
    });

    searchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim().length >= 2) {
        performSearch(e.target.value.trim(), searchResults);
      }
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
        hideSearchResults(searchResults);
      }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (!searchResults) return;
      
      const items = searchResults.querySelectorAll('a');
      const currentFocus = document.activeElement;
      let currentIndex = Array.from(items).indexOf(currentFocus);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[currentIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[currentIndex]?.focus();
      } else if (e.key === 'Escape') {
        hideSearchResults(searchResults);
        searchInput.blur();
      }
    });
  }

  function performSearch(query, searchResults) {
    if (!flexSearch || !searchIndex) return;

    try {
      const results = flexSearch.search(query, { limit: 8 });
      const items = results.map(index => searchIndex[index]);
      
      displaySearchResults(items, query, searchResults);
    } catch (error) {
      console.warn('Search failed:', error);
    }
  }

  function displaySearchResults(items, query, searchResults) {
    if (!searchResults) {
      // Create search results container if it doesn't exist
      searchResults = createSearchResultsContainer();
    }

    if (items.length === 0) {
      searchResults.innerHTML = `
        <div class="p-4 text-gray-500">
          No results found for "${query}"
        </div>
      `;
    } else {
      searchResults.innerHTML = items.map(item => `
        <a href="${item.id}" class="block p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
          <div class="font-medium text-gray-900 dark:text-gray-100">${highlightMatch(item.title, query)}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">${highlightMatch(item.description || item.content, query)}</div>
          ${item.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mt-2">
              ${item.tags.slice(0, 3).map(tag => `<span class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">#${tag}</span>`).join('')}
            </div>
          ` : ''}
        </a>
      `).join('');
    }

    searchResults.classList.remove('hidden');
  }

  function createSearchResultsContainer() {
    const searchForm = document.querySelector('form[role="search"]');
    if (!searchForm) return null;

    const container = document.createElement('div');
    container.id = 'search-results';
    container.className = 'absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md shadow-lg z-50 max-h-96 overflow-y-auto hidden';
    
    searchForm.style.position = 'relative';
    searchForm.appendChild(container);
    
    return container;
  }

  function hideSearchResults(searchResults) {
    if (searchResults) {
      searchResults.classList.add('hidden');
    }
  }

  function highlightMatch(text, query) {
    if (!text || !query) return text || '';
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log('Script loaded successfully:', src);
        resolve();
      };
      script.onerror = (error) => {
        console.error('Script failed to load:', src, error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
})();

/**
 * Baserow API Integration
 * 
 * This module fetches design rows from Baserow table 802146
 * 
 * BASEROW SETUP:
 * - Table ID: 802146
 * - API Token: McF146juRNx86e78in9ZespifU46k3k9
 * - View field structure: https://api.baserow.io/api/database/fields/table/802146/
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const BASEROW_CONFIG = {
  // Your Baserow API token
  API_TOKEN: 'McF146juRNx86e78in9ZespifU46k3k9',
  
  // Table ID for designs
  TABLE_ID: '802146',
  
  // Base URL for Baserow API
  BASE_URL: 'https://api.baserow.io/api',
  
  // Polling interval in milliseconds (30000 = 30 seconds)
  POLL_INTERVAL: 30000
};

// Track last known row count for change detection
let lastRowCount = 0;
let lastDesignIds = [];

// =============================================================================
// FIELD ID MAPPING
// Based on export - Table.json structure
// Fields: id, Name, Description, Active, Image (array with url), Category
// =============================================================================

const FIELD_IDS = {
  id: 'id',                 // Row ID
  title: 'Name',            // Design title
  description: 'Description', // Design description
  category: 'Category',     // Design category
  image: 'Image',           // Field for image (array with url property)
  active: 'Active',         // Field for active status
};

// =============================================================================
// HELPER: Get request headers
// =============================================================================

function getHeaders() {
  return {
    'Authorization': `Token ${BASEROW_CONFIG.API_TOKEN}`,
    'Content-Type': 'application/json'
  };
}

// =============================================================================
// HELPER: Handle API errors
// =============================================================================

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
  }
  return response.json();
}

// =============================================================================
// FUNCTION: Fetch designs from Baserow
// =============================================================================

/**
 * Fetches all design rows from Baserow table 802146
 * @returns {Promise<Array>} Array of design objects
 */
async function fetchDesigns() {
  const url = `${BASEROW_CONFIG.BASE_URL}/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/?user_field_names=true`;
  
  console.log('Fetching designs from Baserow...');
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const data = await handleResponse(response);
    console.log('Designs fetched successfully:', data.results);
    return data.results || [];
    
  } catch (error) {
    console.error('Error fetching designs:', error);
    return [];
  }
}

// =============================================================================
// FUNCTION: Render designs to HTML cards
// =============================================================================

/**
 * Renders fetched designs into the HTML card structure
 * @param {Array} designs - Array of design objects from Baserow
 */
function renderDesigns(designs) {
  const cardsContainer = document.querySelector('.cards');
  
  if (!cardsContainer) {
    console.error('Cards container not found in DOM');
    return;
  }
  
  // Clear existing static cards
  cardsContainer.innerHTML = '';
  
  designs.forEach(design => {
    const card = document.createElement('article');
    card.className = 'card';
    
    // Add data attributes for JavaScript interactions
    card.dataset.id = design.id || '';
    card.dataset.category = design[FIELD_IDS.category] || '';
    
    // Handle Image field - it's an array with url property in Baserow
    const imageField = design[FIELD_IDS.image];
    const imageUrl = Array.isArray(imageField) && imageField.length > 0 
      ? imageField[0].url 
      : './assets/images/placeholder.jpg';
    
    const imageAlt = imageField && Array.isArray(imageField) && imageField.length > 0
      ? imageField[0].visible_name
      : design[FIELD_IDS.title] || 'Design';
    
    // Build card HTML using Baserow data
    card.innerHTML = `
      <img 
        class="card-image" 
        src="${imageUrl}" 
        alt="${imageAlt}" 
      />
      <div class="card-content">
        <h3 class="card-title">${design[FIELD_IDS.title] || 'Untitled Design'}</h3>
        <p class="card-category">${design[FIELD_IDS.category] || 'Uncategorized'}</p>
        <p class="card-description">${design[FIELD_IDS.description] || 'No description available.'}</p>
      </div>
      <div class="card-action">
        <button type="button">Hire Team</button>
      </div>
    `;
    
    cardsContainer.appendChild(card);
  });
}

// =============================================================================
// FUNCTION: Initialize designs (fetch + render)
// =============================================================================

/**
 * Fetches designs from Baserow and renders them to the page
 */
async function initDesigns() {
  const designs = await fetchDesigns();
  lastRowCount = designs.length;
  lastDesignIds = designs.map(d => d.id);
  renderDesigns(designs);
}

// =============================================================================
// FUNCTION: Poll for updates from Baserow
// =============================================================================

/**
 * Polls Baserow for changes and re-renders if updates detected
 * Checks for new, updated, or deleted rows
 */
async function pollForUpdates() {
  try {
    const designs = await fetchDesigns();
    const currentRowCount = designs.length;
    const currentIds = designs.map(d => d.id);
    
    // Check if row count changed
    const countChanged = currentRowCount !== lastRowCount;
    
    // Check if any IDs are different
    const idsChanged = JSON.stringify(currentIds.sort()) !== JSON.stringify(lastDesignIds.sort());
    
    if (countChanged || idsChanged) {
      console.log('Baserow data changed, re-rendering...');
      lastRowCount = currentRowCount;
      lastDesignIds = currentIds;
      renderDesigns(designs);
    }
    
  } catch (error) {
    console.error('Error polling for updates:', error);
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('Baserow integration initialized');
  
  // Initial fetch and render
  initDesigns();
  
  // Start polling for updates
  setInterval(pollForUpdates, BASEROW_CONFIG.POLL_INTERVAL);
});

// =============================================================================
// EXPORTED FUNCTIONS (for console debugging)
// =============================================================================

window.Baserow = {
  fetchDesigns,
  renderDesigns,
  initDesigns,
  pollForUpdates,
  startPolling: () => setInterval(pollForUpdates, BASEROW_CONFIG.POLL_INTERVAL),
  stopPolling: () => {
    // Store interval ID for stopping
    window._baserowPollInterval = window._baserowPollInterval || null;
    if (window._baserowPollInterval) {
      clearInterval(window._baserowPollInterval);
      window._baserowPollInterval = null;
    }
  },
  config: BASEROW_CONFIG,
  fields: FIELD_IDS
};



function doPost(e) {
  // Get the active spreadsheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses') || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get form data from the POST request
  const formData = e.parameter;
  
  // Extract fields
  const name = formData.name || '';
  const email = formData.email || '';
  const phone = formData.phone || '';
  const message = formData.message || '';
  const timestamp = formData.timestamp || new Date().toISOString();
  
  // Append row to spreadsheet
  sheet.appendRow([
    timestamp,
    name,
    email,
    phone,
    message
  ]);
  
  // Return success response
  return ContentService
    .createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Set up the spreadsheet with headers
 * Run this function once to create headers
 */
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Set headers
  const headers = [
    'Timestamp',
    'Name',
    'Email',
    'Phone',
    'Message'
  ];
  
  // Write headers to first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#2C5F2D')
    .setFontColor('#FFFFFF');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Optional: Test function to verify deployment
 * Returns a simple success message
 */
function doGet() {
  return ContentService
    .createTextOutput('Pa Site Form API is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

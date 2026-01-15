
function doPost(e) {
  try {
    // Log incoming request
    console.log('Received form submission');
    console.log('Parameters:', JSON.stringify(e.parameter));
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet ID:', ss.getId());
    
    // Try to get the JoinResponses sheet, or use active sheet
    let sheet = ss.getSheetByName('JoinResponses');
    if (!sheet) {
      console.log('Sheet "JoinResponses" not found, using active sheet');
      sheet = ss.getActiveSheet();
    } else {
      console.log('Found sheet: JoinResponses');
    }
    
    // Get form data from the POST request
    const formData = e.parameter;
    
    // Extract fields (log each one)
    const timestamp = formData.timestamp || new Date().toISOString();
    console.log('Timestamp:', timestamp);
    
    const role = formData.role || '(not set)';
    console.log('Role:', role);
    
    const name = formData.name || '(not set)';
    console.log('Name:', name);
    
    const email = formData.email || '(not set)';
    console.log('Email:', email);
    
    const phone = formData.phone || '(not set)';
    console.log('Phone:', phone);
    
    const experience = formData.experience || '(not set)';
    console.log('Experience:', experience);
    
    const type = formData.type || '(not set)';
    console.log('Type:', type);
    
    const skills = formData.skills || '(not set)';
    console.log('Skills:', skills);
    
    // Append row to spreadsheet
    sheet.appendRow([
      timestamp,
      role,
      name,
      email,
      phone,
      experience,
      type,
      skills
    ]);
    
    console.log('Row added successfully!');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Form submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
    'Role Applied',
    'Full Name',
    'Email',
    'Phone',
    'Experience Level',
    'Role Type',
    'Skills'
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
    .createTextOutput('Pa Site Join Form API is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/
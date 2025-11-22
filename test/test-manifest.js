const { validateManifest } = require('../utils/manifest');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing manifest validation...\n');

// Test valid manifest
const validManifest = {
  name: "Test App",
  version: "1.0.0",
  entry: "index.html",
  description: "A test app",
  developer: "Test Developer",
  permissions: ["wallet", "username"]
};

console.log('Test 1: Valid manifest');
const result1 = validateManifest(validManifest);
console.log(result1.ok ? '✅ PASS' : '❌ FAIL');
console.log('');

// Test invalid manifest
const invalidManifest = {
  name: "Test App",
  version: "1.0.0"
  // missing required fields
};

console.log('Test 2: Invalid manifest');
const result2 = validateManifest(invalidManifest);
console.log(!result2.ok ? '✅ PASS' : '❌ FAIL');
if (result2.errors) {
  console.log('Errors:', result2.errors);
}
console.log('');

// Test template manifest
console.log('Test 3: Template manifest');
const templatePath = path.join(__dirname, '../templates/starter/manifest.json');
const templateManifest = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const result3 = validateManifest(templateManifest);
console.log(result3.ok ? '✅ PASS' : '❌ FAIL');
if (!result3.ok) {
  console.log('Errors:', result3.errors);
}

console.log('\n✅ All tests completed!');

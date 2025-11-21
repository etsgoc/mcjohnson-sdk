const { validateManifest } = require('../dist/manifest');

function testMiniApp({ manifest: manifestPath }) {
  console.log('🧪 Testing mini app...\n');
  
  const fs = require('fs');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  console.log('Checking manifest...');
  const validation = validateManifest(manifest);
  
  if (validation.ok) {
    console.log('✅ Manifest is valid');
  } else {
    console.log('❌ Manifest has errors:');
    validation.errors.forEach(err => console.log(`  - ${err}`));
    process.exit(1);
  }
  
  console.log('\n✅ All tests passed!');
}

module.exports = { testMiniApp };
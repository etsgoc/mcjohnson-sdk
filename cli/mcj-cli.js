#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
  const appName = process.argv[3] || 'my-miniapp';
  console.log(`Creating new mini app: ${appName}`);
  
  // Copy template
  const templateDir = path.join(__dirname, '../templates/starter');
  const targetDir = path.join(process.cwd(), appName);
  
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(templateDir, targetDir, { recursive: true });
  
  console.log(`✅ Created ${appName}!`);
  console.log(`\nNext steps:`);
  console.log(`  cd ${appName}`);
  console.log(`  # Edit manifest.json and index.html`);
  console.log(`  mcj build`);
  
} else if (command === 'build') {
  console.log('Building app...');
  const { packageMiniApp } = require('../packager/package-miniapp.js');
  packageMiniApp('.', 'dist.zip')
    .then(() => console.log('✅ Build complete: dist.zip'))
    .catch(err => console.error('❌ Build failed:', err));
    
} else if (command === 'dev') {
  console.log('Starting dev server...');
  // Would need live reload implementation
  console.log('❌ Dev mode not yet implemented');
  
} else {
  console.log(`
McJohnson Mini App CLI

Commands:
  init [name]    Create a new mini app
  build          Package your app into a .zip
  dev            Start development server (coming soon)
  
Examples:
  mcj init my-game
  mcj build
  `);
}
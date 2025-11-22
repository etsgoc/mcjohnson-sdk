#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const command = process.argv[2];

if (command === 'init') {
  const appName = process.argv[3] || 'my-miniapp';
  console.log(`Creating new mini app: ${appName}`);
  
  const templateDir = path.join(__dirname, '../templates/starter');
  const targetDir = path.join(process.cwd(), appName);
  
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory ${appName} already exists`);
    process.exit(1);
  }
  
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
  const inputDir = process.argv[3] || '.';
  const outputFile = process.argv[4] || 'dist.zip';
  
  packageMiniApp(inputDir, outputFile)
    .then(() => console.log(`✅ Build complete: ${outputFile}`))
    .catch(err => {
      console.error('❌ Build failed:', err.message);
      process.exit(1);
    });
    
} else if (command === 'sign') {
  const subCommand = process.argv[3];
  
  if (subCommand === 'gen-keys') {
    // ✅ Import and call directly
    const nacl = require('tweetnacl');
    const { Buffer } = require('buffer');
    
    try {
      const kp = nacl.sign.keyPair();
      fs.writeFileSync('public.key', Buffer.from(kp.publicKey).toString('hex'));
      fs.writeFileSync('private.key', Buffer.from(kp.secretKey).toString('hex'));
      console.log('✅ Keys written: public.key, private.key');
    } catch (error) {
      console.error('❌ Failed to generate keys:', error.message);
      process.exit(1);
    }
    
  } else if (subCommand === 'sign') {
    const manifestPath = process.argv[4];
    const sigOut = process.argv[5] || 'manifest.sig';
    const privPath = process.argv[6] || 'private.key';
    
    if (!manifestPath) {
      console.error('❌ Usage: mcj sign sign <manifest.json> [output.sig] [private.key]');
      process.exit(1);
    }
    
    // ✅ Import and call directly
    const nacl = require('tweetnacl');
    const { Buffer } = require('buffer');
    
    try {
      if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest not found: ${manifestPath}`);
      }
      if (!fs.existsSync(privPath)) {
        throw new Error(`Private key not found: ${privPath}`);
      }
      
      const manifest = fs.readFileSync(manifestPath);
      const priv = Buffer.from(fs.readFileSync(privPath, 'utf8').trim(), 'hex');
      const sig = nacl.sign.detached(new Uint8Array(manifest), new Uint8Array(priv));
      fs.writeFileSync(sigOut, Buffer.from(sig).toString('hex'));
      console.log(`✅ Signed → ${sigOut}`);
    } catch (error) {
      console.error('❌ Failed to sign:', error.message);
      process.exit(1);
    }
    
  } else {
    console.log(`
Usage:
  mcj sign gen-keys                           Generate signing keys
  mcj sign sign <manifest> [sig] [key]        Sign a manifest file

Examples:
  mcj sign gen-keys
  mcj sign sign manifest.json
  mcj sign sign manifest.json manifest.sig private.key
    `);
  }
    
} else if (command === 'publish') {
  const filePath = process.argv[3];
  
  if (!filePath) {
    console.error('❌ Usage: mcj publish <file.zip>');
    process.exit(1);
  }
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log('📤 Publishing to IPFS...');
  const { publish } = require('../tools/publish-ipfs.js');
  
  publish(filePath)
    .then((cid) => {
      console.log('✅ Published to IPFS');
      console.log(`CID: ${cid}`);
    })
    .catch(err => {
      console.error('❌ Publish failed:', err.message);
      process.exit(1);
    });
    
} else {
  console.log(`
McJohnson Mini App CLI

Commands:
  init [name]              Create a new mini app
  build [dir] [output]     Package your app into a .zip
  sign gen-keys            Generate signing keys
  sign sign <manifest>     Sign a manifest file
  publish <file>           Publish to IPFS
  
Examples:
  mcj init my-game
  mcj build . my-game.zip
  mcj sign gen-keys
  mcj sign sign manifest.json
  mcj publish my-game.zip
  `);
}
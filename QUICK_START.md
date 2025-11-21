# Quick Start Guide - Building Your First Mini App

## Prerequisites

- Basic HTML/CSS/JavaScript knowledge
- Text editor (VS Code recommended)
- McJohnson Wallet installed (for testing)

## Step 1: Create Project Structure

```bash
mkdir my-first-miniapp
cd my-first-miniapp
```

Create these files:

```
my-first-miniapp/
├── manifest.json
├── index.html
└── icon-48.png (optional)
```

## Step 2: Create manifest.json

```json
{
  "name": "Hello World",
  "version": "1.0.0",
  "entry": "index.html",
  "description": "My first mini app",
  "punchline": "Learning the basics",
  "developer": "Your Name",
  "category": "Tools",
  "permissions": ["wallet", "username"],
  "icons": {
    "48": "icon-48.png"
  },
  "website": "https://yoursite.com",
  "supportUrl": "https://yoursite.com/support"
}
```

## Step 3: Create index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      padding-top: 70px; /* Space for header */
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #667eea;
      margin: 0 0 16px 0;
    }
    button {
      width: 100%;
      padding: 14px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 12px;
    }
    button:active {
      background: #5a67d8;
    }
    .info {
      background: #f7fafc;
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>👋 Hello World</h1>
    <p>Welcome to your first mini app!</p>
  </div>

  <div class="card">
    <h2>Your Info</h2>
    <div id="info" class="info">Loading...</div>
    <button onclick="loadInfo()">Refresh Info</button>
  </div>

  <script>
    // Wait for SDK to be ready
    function waitForSDK() {
      return new Promise((resolve) => {
        if (typeof window.mcj !== 'undefined') {
          resolve();
        } else {
          setTimeout(() => waitForSDK().then(resolve), 100);
        }
      });
    }

    // Load user info
    async function loadInfo() {
      try {
        // Get wallet address
        const addressResult = await window.mcj.wallet.getAddress();
        
        // Get balance
        const balanceResult = await window.mcj.wallet.getBalance();
        
        // Get username
        const usernameResult = await window.mcj.user.getUsername();
        
        // Display info
        const info = document.getElementById('info');
        info.innerHTML = `
          <strong>Address:</strong><br>
          ${addressResult.address}<br><br>
          <strong>Balance:</strong><br>
          ${parseFloat(balanceResult.balance).toFixed(4)} LTCO<br><br>
          <strong>Username:</strong><br>
          ${usernameResult.username || 'Not set'}
        `;
      } catch (error) {
        document.getElementById('info').innerHTML = 
          `Error: ${error.message || 'Failed to load info'}`;
      }
    }

    // Initialize
    waitForSDK().then(() => {
      console.log('SDK ready!');
      loadInfo();
    });
  </script>
</body>
</html>
```

## Step 4: Test Locally

### Option A: Manual Installation

1. Open McJohnson Wallet
2. Go to Settings → Storage & Cache
3. Tap "Install Sample App" button
4. Your app appears in "My Apps"

### Option B: Developer Installation

```typescript
// In your container app
import { installMiniAppManual } from '@mcjohnson/miniapp-sdk';
import * as FileSystem from 'expo-file-system';

async function installMyApp() {
  // Copy HTML to app directory
  const appDir = `${FileSystem.documentDirectory}miniapps/hello-world-1.0.0/`;
  await FileSystem.makeDirectoryAsync(appDir, { intermediates: true });
  
  const htmlContent = `/* your HTML here */`;
  await FileSystem.writeAsStringAsync(
    `${appDir}index.html`,
    htmlContent
  );
  
  await installMiniAppManual({
    id: 'hello-world-1.0.0',
    name: 'Hello World',
    version: '1.0.0',
    icon: 'data:image/png;base64,...',
    localPath: `file://${appDir}index.html`,
    manifest: { /* your manifest */ }
  });
}
```

## Step 5: Package for Distribution

```bash
# Install dependencies
npm install archiver

# Package your app
node ../../packager/package-miniapp.js . hello-world.zip
```

## Step 6: Sign (Optional but Recommended)

```bash
# Generate keys (first time only)
node ../../tools/sign-cli.js gen-keys

# Sign manifest
node ../../tools/sign-cli.js sign manifest.json manifest.sig private.key
```

## Step 7: Publish to IPFS

```bash
# Add signature to package
zip hello-world.zip manifest.sig

# Publish
node ../../tools/publish-ipfs.js hello-world.zip

# Output: QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Step 8: Users Install via CID

Users can now install your app by entering the IPFS CID in the Explore tab!

## Common SDK Methods

### Wallet APIs

```javascript
// Get address
const { address } = await window.mcj.wallet.getAddress();

// Get balance
const { balance } = await window.mcj.wallet.getBalance();

// Sign transaction
const result = await window.mcj.wallet.sign({
  to: '0x123...',
  value: '1000000000000000000', // in wei
  chainId: 80002,
  // Or use meta.transfer for ERC20
  meta: {
    transfer: {
      to: '0x123...',
      amount: '1000000000000000000'
    }
  }
});
```

### User APIs

```javascript
// Get username
const { username } = await window.mcj.user.getUsername();
```

### Camera

```javascript
const result = await window.mcj.camera.open({
  quality: 0.8,
  allowsEditing: false
});

if (result.ok && result.result.assets) {
  const photo = result.result.assets[0];
  console.log('Photo URI:', photo.uri);
}
```

### Location

```javascript
const result = await window.mcj.location.get();

if (result.ok) {
  const { latitude, longitude } = result.location.coords;
  console.log(`Location: ${latitude}, ${longitude}`);
}
```

### Storage

```javascript
// Save file
await window.mcj.storage.save('data.json', base64Data);
```

### Notifications

```javascript
await window.mcj.notifications.send(
  'Hello!',
  'This is a notification from your mini app'
);
```

## Error Handling

```javascript
try {
  const result = await window.mcj.wallet.sign(tx);
  
  if (!result.ok) {
    console.error('Transaction failed:', result.error);
  }
} catch (error) {
  if (error.error === 'permission_denied') {
    alert('This feature requires wallet permission');
  } else {
    alert('Error: ' + error.message);
  }
}
```

## Best Practices

1. **Always wait for SDK**: Use `waitForSDK()` before calling APIs
2. **Handle errors gracefully**: Users might deny permissions
3. **Show loading states**: API calls take time
4. **Minimize permissions**: Only request what you need
5. **Test on real devices**: Emulators may not support all features
6. **Use semantic HTML**: Better accessibility
7. **Optimize images**: Keep file size small
8. **Add padding-top**: Leave space for the floating header (64px+)

## Debugging Tips

```javascript
// Log all API calls
console.log('SDK available:', !!window.mcj);
console.log('SDK version:', window.MCJ_META);

// Test if permission works
window.mcj.permissions.request('camera')
  .then(granted => console.log('Camera permission:', granted));
```

## Next Steps

- Read the full [API Reference](./API.md)
- Check out [Example Apps](./examples/)
- Join our [Discord](https://discord.gg/mcjohnson)
- Submit your app to the store!

## Need Help?

- 📚 [Full Documentation](https://docs.mcjohnson.io)
- 💬 [Discord Community](https://discord.gg/mcjohnson)
- 📧 [Email Support](mailto:support@mcjohnson.io)
- 🐛 [Report Issues](https://github.com/mcjohnson/miniapp-sdk/issues)
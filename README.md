# McJohnson Mini App Developer SDK

> Build, test, and publish mini-applications for the McJohnson Wallet ecosystem.

[![npm version](https://img.shields.io/npm/v/@mcjohnson/miniapp-developer-sdk.svg)](https://www.npmjs.com/package/@mcjohnson/miniapp-developer-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 What is This?

This SDK provides **command-line tools** for mini app developers to:

- 🚀 **Bootstrap** new mini app projects
- 📦 **Package** apps into distributable bundles
- 🔐 **Sign** manifests for verification
- 📤 **Publish** to IPFS for decentralized distribution
- 🧪 **Test** locally with live preview server

**Note**: This SDK is for **mini app developers**, not container app developers. If you're building the wallet/container app, see our [Container SDK](https://github.com/etsgoc/mcjohnson-sdk).

---

## 🚀 Quick Start

### Installation
```bash
npm install -g @mcjohnson/miniapp-developer-sdk
```

### Create Your First Mini App
```bash
# Create new project
mcj init my-first-app

# Enter the directory
cd my-first-app

# Start development server
mcj dev --qr

# Scan QR code with McJohnson Wallet to test
```

---

## 📦 CLI Commands

### `mcj init <name>`

Create a new mini app project with a starter template.
```bash
mcj init my-game
```

Creates:
```
my-game/
├── manifest.json
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

### `mcj dev [options]`

Start a local development server to test your app.

**Options:**
- `--qr` - Display QR code for mobile testing
- `--port=<port>` - Custom port (default: 3000)
```bash
# Basic dev server
mcj dev

# With QR code for mobile testing
mcj dev --qr

# Custom port
mcj dev --port=8080
```

**Testing Workflow:**
1. Run `mcj dev --qr` in your project
2. Open McJohnson Wallet on your phone
3. Go to **Developer Portal**
4. Scan QR code or enter URL manually
5. Your app opens in the production environment with all permissions

---

### `mcj build [options]`

Package your mini app into a distributable .zip file.
```bash
# Build current directory
mcj build

# Build specific directory
mcj build ./my-app

# Custom output name
mcj build . my-app-v1.0.0.zip
```

**Output**: `dist.zip` containing your entire app

---

### `mcj sign <command>`

Sign your manifest for cryptographic verification.

**Generate Keys** (one-time):
```bash
mcj sign gen-keys
```
Creates `public.key` and `private.key`

**Sign Manifest**:
```bash
mcj sign sign manifest.json
```
Creates `manifest.sig`

**Verify Signature**:
```bash
mcj sign verify manifest.json manifest.sig public.key
```

---

### `mcj publish <file>`

Publish your app package to IPFS.
```bash
mcj publish dist.zip
```

**Output**:
```
✅ Published to IPFS!
CID: QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Users can install via:
https://ipfs.io/ipfs/QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

### `mcj test`

Validate your manifest and check for common issues.
```bash
mcj test
```

**Checks:**
- ✅ Valid manifest.json
- ✅ Required files present
- ✅ Icon dimensions
- ⚠️ File size warnings
- ⚠️ Missing optional files

---

## 🎨 Project Structure
```
my-miniapp/
├── manifest.json       # App metadata & permissions
├── index.html          # Entry point
├── styles.css          # Styling (optional)
├── app.js              # Your app logic (optional)
├── assets/             # Images, fonts, etc.
│   ├── icon-48.png
│   └── icon-96.png
└── README.md           # Documentation
```

---

## 📋 Manifest Format

**Required Fields:**
```json
{
  "name": "My Mini App",
  "version": "1.0.0",
  "entry": "index.html",
  "description": "A brief description of your app",
  "developer": "Your Name",
  "category": "Games",
  "permissions": ["wallet", "username"],
  "icons": {
    "48": "assets/icon-48.png",
    "96": "assets/icon-96.png"
  }
}
```

**Optional Fields:**
```json
{
  "punchline": "Short catchy description",
  "website": "https://yoursite.com",
  "supportUrl": "https://yoursite.com/support",
  "termsUrl": "https://yoursite.com/terms",
  "privacyUrl": "https://yoursite.com/privacy"
}
```

**Categories:**
- Games
- Finance
- Tools
- Social
- NFTs
- Marketplace
- Utilities

**Available Permissions:**
- `wallet` - Access wallet address & balance
- `username` - Access user's handle
- `sign` - Request transaction signing
- `camera` - Access device camera
- `location` - Access GPS location
- `storage` - Store data locally
- `notifications` - Send push notifications

---

## 🌐 Using the SDK Bridge

Inside your mini app's JavaScript:
```javascript
// Wait for SDK
async function waitForSDK() {
  return new Promise((resolve) => {
    if (typeof window.mcj !== 'undefined') {
      resolve();
    } else {
      setTimeout(() => waitForSDK().then(resolve), 100);
    }
  });
}

// Get wallet address
await waitForSDK();
const result = await window.mcj.wallet.getAddress();
if (result.ok) {
  console.log('Address:', result.address);
}

// Get balance
const balance = await window.mcj.wallet.getBalance();
console.log('Balance:', balance.balance, 'LTCO');

// Sign transaction
const tx = {
  meta: {
    transfer: {
      to: '0x123...',
      amount: '1000000000000000000' // 1 LTCO
    }
  },
  chainId: 137
};
const signed = await window.mcj.wallet.sign(tx);

// Open camera
const photo = await window.mcj.camera.open({ quality: 0.8 });

// Get location
const location = await window.mcj.location.get();

// Send notification
await window.mcj.notifications.send('Hello!', 'From my app');
```

**Full API documentation**: [API_REFERENCE.md](./API_REFERENCE.md)

---

## 📤 Publishing Your App

### Step 1: Prepare Your App
```bash
# Validate manifest
mcj test

# Build package
mcj build
```

### Step 2: Sign Your App (Recommended)
```bash
# Generate keys (first time only)
mcj sign gen-keys

# Sign manifest
mcj sign sign manifest.json
```

### Step 3: Publish to IPFS
```bash
mcj publish dist.zip
```

**Output CID**: `QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### Step 4: Submit to App Registry

To get your app featured in the Explore tab:

1. Go to [Registry Submissions](https://github.com/etsgoc/mcjohnson-miniapp-registry/issues/new)
2. Click "New Issue" → "Mini App Submission"
3. Fill out the template with:
   - IPFS CID
   - Screenshots (2+)
   - `manifest.json`
   - `public.key` (if signed)
   - Privacy policy URL
4. Submit and wait for review (3-5 days)

**Alternatively**, email: [registry@mcjohnson.io](mailto:registry@mcjohnson.io)

---

## 🧪 Testing Your App

### Option 1: Dev Server (Recommended)
```bash
mcj dev --qr
```

1. Scan QR code with McJohnson Wallet
2. Go to **Developer Portal** in wallet
3. Your app opens in production environment
4. All SDK features work
5. Make changes, save, and refresh

### Option 2: Manual Installation

1. Build your app: `mcj build`
2. Copy `dist.zip` to your device
3. In wallet, go to **Settings → Developer Tools**
4. Install from file

### Option 3: IPFS Testing
```bash
# Publish to IPFS
mcj publish dist.zip

# Copy the CID (QmXXX...)
```

In wallet:
1. Go to **Explore** tab
2. Tap "Install from IPFS"
3. Paste CID
4. Install and test

---

## 📚 Documentation

- 📖 [Quick Start Guide](./QUICK_START.md) - Build your first app
- 🔧 [API Reference](./API_REFERENCE.md) - Complete SDK documentation
- 🤝 [Contributing](./CONTRIBUTING.md) - How to contribute
- 📋 [Examples](./examples/) - Sample mini apps

---

## 🎯 Use Cases

Perfect for building:
- 🎮 **Games** - Casual games, leaderboards
- 💰 **DeFi Tools** - Swaps, staking dashboards
- 🎨 **NFT Apps** - Galleries, minting tools
- 📊 **Analytics** - Portfolio trackers, charts
- 🛍️ **Marketplaces** - Buy/sell/trade
- 🤝 **Social Apps** - Forums, DAOs
- 🔧 **Utilities** - Calculators, converters

---

## 🔒 Security Best Practices

1. ✅ Request minimum permissions needed
2. ✅ Handle permission denials gracefully
3. ✅ Never store sensitive data in localStorage
4. ✅ Validate all user inputs
5. ✅ Use HTTPS for external resources
6. ✅ Sign your manifests for verification
7. ✅ Test on real devices

---

## 🐛 Troubleshooting

### SDK Not Available
```javascript
// ❌ Bad
const address = await window.mcj.wallet.getAddress();

// ✅ Good
await waitForSDK();
const address = await window.mcj.wallet.getAddress();
```

### Permission Denied
```javascript
try {
  const result = await window.mcj.camera.open();
  if (!result.ok && result.error === 'permission_denied') {
    alert('Camera permission required. Enable in app settings.');
  }
} catch (error) {
  console.error('Camera error:', error);
}
```

### Dev Server Won't Connect

- ✅ Ensure phone and computer are on same WiFi
- ✅ Check firewall allows incoming connections
- ✅ Try using IP address instead of localhost
- ✅ Verify dev server is running

### Build Fails
```bash
# Clean and rebuild
rm -rf dist.zip node_modules
npm install
mcj build
```

---

## 🆘 Support

- 📧 **Email**: [dev@mcjohnson.io](mailto:dev@mcjohnson.io)
- 💬 **Discord**: [Join Community](https://discord.gg/mcjohnson)
- 🐛 **Issues**: [GitHub Issues](https://github.com/etsgoc/mcjohnson-miniapp-developer-sdk/issues)
- 📚 **Docs**: [Full Documentation](https://docs.mcjohnson.io)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © McJohnson Team

---

## 🚀 Get Started Now
```bash
npm install -g @mcjohnson/miniapp-developer-sdk
mcj init my-first-app
cd my-first-app
mcj dev --qr
```

**Build the future of decentralized applications!** 🎉



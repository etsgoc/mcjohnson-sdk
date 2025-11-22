# McJohnson Mini App SDK

> A complete SDK for building, installing, and running mini-applications within the McJohnson Wallet ecosystem.

## 🚀 Quick Start

### Installation

```bash
# Install SDK in your React Native project
npm install mcjohnson-sdk

# Or with yarn
yarn add mcjohnson-sdk
```

### Basic Usage

```typescript
import { 
  initializeSDK, 
  SandboxWebView, 
  getInstalledApps 
} from 'mcjohnson-sdk';

// Initialize on app start
await initializeSDK();

// Get installed apps
const apps = await getInstalledApps();

// Render a mini app
<SandboxWebView
  appId={app.id}
  sourceUri={app.localPath}
  nativeApi={nativeApiExpo}
  grantedPermissions={permissions}
/>
```

## 📋 Features

- ✅ **Sandboxed WebView** - Secure execution environment
- ✅ **Permission System** - Granular user consent
- ✅ **Wallet Integration** - Access to user wallet & signing
- ✅ **Native APIs** - Camera, location, storage, notifications
- ✅ **IPFS Support** - Decentralized app distribution
- ✅ **Signature Verification** - Cryptographic app validation

## 🎯 Use Cases

Perfect for:
- 🎮 **Games** - Casual games, NFT games
- 💰 **DeFi Tools** - Swaps, staking, analytics
- 🎨 **NFT Apps** - Galleries, minting, trading
- 📊 **Analytics** - Portfolio trackers, charts
- 🛍️ **Marketplaces** - Buy/sell/trade
- 🤝 **Social** - Forums, chats, DAOs
- 🔧 **Utilities** - Calculators, converters, tools

## 🏗️ Architecture

### Components

1. **SandboxWebView** - Secure iframe-like container
2. **PermissionConsentModal** - User permission requests
3. **MiniAppManager** - Installation & lifecycle
4. **PermissionManager** - Permission storage & validation

### Data Flow

```
User Opens App → Check Permissions → Load WebView → Inject Bridge → App Running
                       ↓
                 Permission Denied?
                       ↓
                 Show Consent Modal
```

## 📦 Building Mini Apps

### Project Structure

```
my-miniapp/
├── manifest.json       # App metadata & permissions
├── index.html          # Entry point
├── app.js             # Your app logic
├── styles.css         # Styling
└── assets/            # Images, fonts, etc.
```

### Manifest Example

```json
{
  "name": "My Mini App",
  "version": "1.0.0",
  "entry": "index.html",
  "description": "A cool mini app",
  "developer": "Your Name",
  "permissions": ["wallet", "camera"],
  "icons": {
    "48": "icon-48.png",
    "96": "icon-96.png"
  }
}
```

### Using the SDK Bridge

```javascript
// Access wallet
const address = await window.mcj.wallet.getAddress();
const balance = await window.mcj.wallet.getBalance();

// Sign transaction
const result = await window.mcj.wallet.sign({
  to: '0x123...',
  value: '1000000000000000000', // 1 token
  chainId: 80002
});

// Open camera
const photo = await window.mcj.camera.open({ quality: 0.8 });

// Get location
const location = await window.mcj.location.get();

// Send notification
await window.mcj.notifications.send('Title', 'Body');
```

## 🔒 Permissions

### Available Permissions

| Permission | Description | Required |
|-----------|-------------|----------|
| `wallet` | Access wallet address & balance | ⚠️ Core |
| `username` | Access user's handle | ⚠️ Core |
| `sign` | Request transaction signing | ⚠️ Core |
| `camera` | Access device camera | Optional |
| `location` | Access GPS location | Optional |
| `storage` | Store data locally | Optional |
| `notifications` | Send push notifications | Optional |
| `microphone` | Access microphone | Optional |
| `contacts` | Access contacts (future) | Optional |
| `biometrics` | Use biometric auth (future) | Optional |

### Permission Flow

1. User installs app
2. App requests permissions in manifest
3. User sees consent modal on first launch
4. User grants/denies permissions
5. Permissions stored persistently
6. Runtime validation on each API call

## 📤 Publishing

### 1. Package Your App

```bash
node packager/package-miniapp.js my-miniapp/ output.zip
```

### 2. Sign the Package

```bash
# Generate keys (one-time)
node tools/sign-cli.js gen-keys

# Sign manifest
node tools/sign-cli.js sign manifest.json manifest.sig private.key
```

### 3. Publish to IPFS

```bash
node tools/publish-ipfs.js output.zip
# Output: QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Users Install

```typescript
import { installFromIPFS } from '@mcjohnson/miniapp-sdk';

const result = await installFromIPFS('QmXXXXXX...');
if (result.success) {
  console.log('Installed!', result.appId);
}
```

## 🧪 Testing

### Install Sample App

```typescript
import { installSampleMiniApp } from '@mcjohnson/miniapp-sdk';

// Installs a demo app for testing
await installSampleMiniApp();
```

### Test Permissions

```typescript
import { 
  updatePermissions, 
  hasPermission 
} from '@mcjohnson/miniapp-sdk';

// Grant permission
await updatePermissions(
  appId, 
  appName, 
  ['wallet', 'camera'], 
  []
);

// Check permission
const canUseCamera = await hasPermission(appId, 'camera');
```

## 🛠️ API Reference

### Mini App Manager

```typescript
// Get all installed apps
const apps = await getInstalledApps();

// Install from bundle
await installMiniAppFromBundle(zipPath);

// Install from IPFS
await installFromIPFS(cid);

// Uninstall
await uninstallMiniApp(appId);

// Update app metadata
await updateMiniApp(appId, { version: '1.1.0' });
```

### Permission Manager

```typescript
// Check consent
const hasConsent = await hasInitialConsent(appId);

// Get app permissions
const perms = await getAppPermissions(appId);

// Update permissions
await updatePermissions(appId, appName, granted, denied);

// Revoke all
await revokeAllPermissions(appId);
```

### Manifest Utils

```typescript
import { validateManifest } from '@mcjohnson/miniapp-sdk';

const result = validateManifest(manifest);
if (!result.ok) {
  console.error('Invalid:', result.errors);
}
```

## 🚨 Security Best Practices

### For Container App Developers

1. ✅ Always validate manifests before installation
2. ✅ Use signature verification for production apps
3. ✅ Implement rate limiting on API calls
4. ✅ Never expose private keys to mini apps
5. ✅ Sanitize all user inputs
6. ✅ Use HTTPS-only for external resources

### For Mini App Developers

1. ✅ Request minimum permissions needed
2. ✅ Handle permission denials gracefully
3. ✅ Never store sensitive data in localStorage
4. ✅ Use CSP headers when possible
5. ✅ Test on multiple devices
6. ✅ Provide clear privacy policy

## 📝 Environment Variables

```bash
# Container App (.env)
EXPO_PUBLIC_MCJ_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
EXPO_PUBLIC_MCJ_CHAIN_ID=80002
EXPO_PUBLIC_LTCO_ADDR=0xYourTokenAddress
EXPO_PUBLIC_HANDLE_REGISTRY_ADDRESS=0xYourRegistryAddress
EXPO_PUBLIC_MCJ_TOKEN_DECIMALS=18

# For Reports (optional)
EXPO_PUBLIC_TELEGRAM_MINIAPP_BOT_TOKEN=your_bot_token
EXPO_PUBLIC_TELEGRAM_MINIAPP_CHAT_ID=your_chat_id
```

## 🐛 Troubleshooting

### WebView Not Loading

```typescript
// Check file:// path is correct
console.log('Loading from:', app.localPath);

// Ensure HTML has proper meta tags
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Permission Denied Errors

```typescript
// Always check permissions before API calls
try {
  const result = await window.mcj.camera.open();
} catch (error) {
  if (error.error === 'permission_denied') {
    alert('Camera permission required');
  }
}
```

### Bridge Not Available

```javascript
// Wait for SDK to load
function waitForSDK() {
  return new Promise((resolve) => {
    if (typeof window.mcj !== 'undefined') {
      resolve();
    } else {
      setTimeout(() => waitForSDK().then(resolve), 100);
    }
  });
}

await waitForSDK();
// Now safe to use window.mcj
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © McJohnson Team



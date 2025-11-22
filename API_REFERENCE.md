# Mini App SDK - Complete API Reference

## Table of Contents

1. [SDK Bridge API](#sdk-bridge-api)
2. [Wallet APIs](#wallet-apis)
3. [User APIs](#user-apis)
4. [Device APIs](#device-apis)
5. [Permission APIs](#permission-apis)
6. [Error Handling](#error-handling)
7. [Types & Interfaces](#types--interfaces)

---

## SDK Bridge API

### window.mcj

The global SDK object injected into your mini app's WebView.

```typescript
interface McJohnsonSDK {
  wallet: WalletAPI;
  user: UserAPI;
  camera: CameraAPI;
  location: LocationAPI;
  storage: StorageAPI;
  notifications: NotificationAPI;
  permissions: PermissionAPI;
}
```

### Initialization

```javascript
// Always wait for SDK to be ready
async function waitForSDK() {
  return new Promise((resolve) => {
    if (typeof window.mcj !== 'undefined') {
      resolve();
    } else {
      setTimeout(() => waitForSDK().then(resolve), 100);
    }
  });
}

// Use it
await waitForSDK();
console.log('SDK ready!');
```

---

## Wallet APIs

### getAddress()

Get the user's wallet address.

**Required Permission**: `wallet`

```javascript
const result = await window.mcj.wallet.getAddress();

// Success response
{
  ok: true,
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}

// Error response
{
  ok: false,
  error: "permission_denied",
  permission: "wallet"
}
```

**Example**:
```javascript
try {
  const { address } = await window.mcj.wallet.getAddress();
  console.log('User address:', address);
  
  // Shorten address for display
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  document.getElementById('address').textContent = short;
} catch (error) {
  if (error.error === 'permission_denied') {
    alert('Please grant wallet permission');
  }
}
```

### getBalance()

Get the user's LTCO token balance.

**Required Permission**: `wallet`

```javascript
const result = await window.mcj.wallet.getBalance();

// Response
{
  ok: true,
  balance: "123.45" // String in token units (not wei)
}
```

**Example**:
```javascript
const { balance } = await window.mcj.wallet.getBalance();
const formatted = parseFloat(balance).toFixed(4);
document.getElementById('balance').textContent = `${formatted} LTCO`;
```

### sign(transaction)

Request the user to sign and send a transaction.

**Required Permission**: `sign`

**Parameters**:
```typescript
interface Transaction {
  to?: string;              // Recipient address
  value?: string;           // ETH value in wei (for native transfers)
  data?: string;            // Transaction data
  chainId: number;          // Chain ID (80002 for Polygon Amoy)
  gasLimit?: string;        // Gas limit (estimated if not provided)
  nonce?: number;           // Nonce (auto-filled if not provided)
  
  // Shortcut for ERC20 transfers
  meta?: {
    transfer?: {
      to: string;           // Recipient
      amount: string;       // Amount in wei
    }
  }
}
```

**Example 1: ERC20 Transfer (LTCO)**
```javascript
const tx = {
  meta: {
    transfer: {
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      amount: '1000000000000000000' // 1 LTCO (18 decimals)
    }
  },
  chainId: 80002
};

const result = await window.mcj.wallet.sign(tx);

if (result.ok) {
  console.log('Transaction hash:', result.result.txHash);
  console.log('Signature:', result.result.signature);
}
```

**Example 2: Contract Interaction**
```javascript
// Encode contract call (use ethers.js CDN)
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.esm.min.js';

const iface = new ethers.Interface([
  'function mint(address to, uint256 amount)'
]);

const data = iface.encodeFunctionData('mint', [
  userAddress,
  ethers.parseUnits('10', 18)
]);

const tx = {
  to: '0xContractAddress',
  data: data,
  value: '0',
  chainId: 80002
};

await window.mcj.wallet.sign(tx);
```

**Response**:
```javascript
{
  ok: true,
  result: {
    signature: "0x...",
    txHash: "0x123abc..."
  }
}
```

---

## User APIs

### getUsername()

Get the user's registered username/handle.

**Required Permission**: `username`

```javascript
const result = await window.mcj.user.getUsername();

// Success
{
  ok: true,
  username: "alice"
}

// No username set
{
  ok: true,
  username: null
}
```

**Example**:
```javascript
const { username } = await window.mcj.user.getUsername();

if (username) {
  document.getElementById('greeting').textContent = `Hello, @${username}!`;
} else {
  document.getElementById('greeting').textContent = 'Hello, guest!';
}
```

---

## Device APIs

### Camera

#### camera.open(options)

Open the device camera to take a photo.

**Required Permission**: `camera`

**Parameters**:
```typescript
interface CameraOptions {
  quality?: number;        // 0.0 to 1.0 (default: 0.8)
  allowsEditing?: boolean; // Allow cropping (default: false)
  aspect?: [number, number]; // Aspect ratio [width, height]
}
```

**Example**:
```javascript
const result = await window.mcj.camera.open({
  quality: 0.8,
  allowsEditing: true,
  aspect: [4, 3]
});

if (result.ok && result.result.assets) {
  const photo = result.result.assets[0];
  
  // Display image
  const img = document.createElement('img');
  img.src = photo.uri;
  img.style.width = '100%';
  document.getElementById('photo').appendChild(img);
  
  console.log('Photo info:', {
    uri: photo.uri,
    width: photo.width,
    height: photo.height,
    type: photo.type
  });
}
```

**Response**:
```javascript
{
  ok: true,
  result: {
    canceled: false,
    assets: [{
      uri: "file:///path/to/photo.jpg",
      width: 1920,
      height: 1080,
      type: "image",
      fileSize: 245678
    }]
  }
}
```

### Location

#### location.get()

Get the device's current GPS location.

**Required Permission**: `location`

**Example**:
```javascript
const result = await window.mcj.location.get();

if (result.ok) {
  const { latitude, longitude, accuracy } = result.location.coords;
  
  console.log(`Location: ${latitude}, ${longitude}`);
  console.log(`Accuracy: ±${accuracy}m`);
  
  // Use with mapping service
  const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
  window.open(mapUrl);
}
```

**Response**:
```javascript
{
  ok: true,
  location: {
    coords: {
      latitude: 40.7128,
      longitude: -74.0060,
      altitude: 10.5,
      accuracy: 65.0,
      altitudeAccuracy: 10.0,
      heading: 90.0,
      speed: 0.0
    },
    timestamp: 1704063600000
  }
}
```

### Storage

#### storage.save(path, data)

Save data to device storage.

**Required Permission**: `storage`

**Parameters**:
- `path` (string): File path relative to app directory
- `data` (string): Base64-encoded file data

**Example**:
```javascript
// Save JSON data
const myData = { score: 100, level: 5 };
const json = JSON.stringify(myData);
const base64 = btoa(json);

const result = await window.mcj.storage.save('game-save.json', base64);

if (result.ok) {
  console.log('Saved to:', result.result.uri);
}
```

**Note**: For reading files, you'll need to use your own storage mechanism or request the file through the storage API in future versions.

### Notifications

#### notifications.send(title, body)

Send a local notification to the user.

**Required Permission**: `notifications`

**Parameters**:
- `title` (string): Notification title
- `body` (string): Notification message

**Example**:
```javascript
await window.mcj.notifications.send(
  '🎉 Achievement Unlocked!',
  'You reached level 10!'
);

**Note**: The notification will automatically include your app ID for deep linking. When users tap the notification, they'll be taken directly to your app.

// With timer
setTimeout(() => {
  window.mcj.notifications.send(
    '⏰ Reminder',
    'Come back to claim your daily reward!'
  );
}, 60000); // 1 minute
```

**Response**:
```javascript
{
  ok: true
}
```

---

## Permission APIs

### permissions.request(permission)

Request a runtime permission from the user.

**Note**: This is mainly for device-level permissions (camera, location) that may need OS-level approval.

**Example**:
```javascript
// Check if we have camera permission
try {
  const granted = await window.mcj.permissions.request('camera');
  
  if (granted.ok) {
    console.log('Camera permission granted');
    openCamera();
  } else {
    alert('Camera permission is required for this feature');
  }
} catch (error) {
  console.error('Permission request failed:', error);
}
```

---

## Error Handling

### Error Types

All API calls return a response object with `ok` property:

```typescript
interface SuccessResponse<T> {
  ok: true;
  [key: string]: T;
}

interface ErrorResponse {
  ok: false;
  error: string;
  permission?: string;  // Which permission was denied
  message?: string;     // Human-readable error
}
```

### Common Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `permission_denied` | User denied the permission | Ask user to enable in settings |
| `no_private_key` | No wallet configured | Direct user to create wallet |
| `timeout` | Request took too long | Retry the operation |
| `unknown_action` | Invalid API call | Check API method name |

### Handling Errors

```javascript
async function safeApiCall() {
  try {
    const result = await window.mcj.wallet.getAddress();
    
    if (!result.ok) {
      // Handle API-level error
      switch (result.error) {
        case 'permission_denied':
          showPermissionPrompt('wallet');
          break;
        case 'no_private_key':
          redirectToWalletSetup();
          break;
        default:
          showError(`Error: ${result.error}`);
      }
      return;
    }
    
    // Success!
    const { address } = result;
    updateUI(address);
    
  } catch (error) {
    // Handle exception
    console.error('Unexpected error:', error);
    showError('Something went wrong. Please try again.');
  }
}
```

### Retry Logic

```javascript
async function retryableCall(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      if (result.ok) return result;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}

// Usage
const result = await retryableCall(() => 
  window.mcj.wallet.getBalance()
);
```

---

## Types & Interfaces

### Complete TypeScript Definitions

```typescript
declare global {
  interface Window {
    mcj: McJohnsonSDK;
    MCJ_META: {
      appId: string;
      version: string;
    };
  }
}

interface McJohnsonSDK {
  wallet: {
    getAddress(): Promise<AddressResponse>;
    getBalance(): Promise<BalanceResponse>;
    sign(tx: Transaction): Promise<SignResponse>;
  };
  
  user: {
    getUsername(): Promise<UsernameResponse>;
  };
  
  camera: {
    open(options?: CameraOptions): Promise<CameraResponse>;
  };
  
  location: {
    get(): Promise<LocationResponse>;
  };
  
  storage: {
    save(path: string, data: string): Promise<StorageResponse>;
  };
  
  notifications: {
    send(title: string, body: string): Promise<NotificationResponse>;
  };
  
  permissions: {
    request(permission: string): Promise<PermissionResponse>;
  };
}

type AddressResponse = 
  | { ok: true; address: string }
  | { ok: false; error: string };

type BalanceResponse = 
  | { ok: true; balance: string }
  | { ok: false; error: string };

type SignResponse = 
  | { ok: true; result: { signature: string; txHash: string } }
  | { ok: false; error: string };

type UsernameResponse = 
  | { ok: true; username: string | null }
  | { ok: false; error: string };

type CameraResponse = 
  | { ok: true; result: CameraResult }
  | { ok: false; error: string };

type LocationResponse = 
  | { ok: true; location: LocationResult }
  | { ok: false; error: string };

type StorageResponse = 
  | { ok: true; result: { uri: string } }
  | { ok: false; error: string };

type NotificationResponse = 
  | { ok: true }
  | { ok: false; error: string };

type PermissionResponse = 
  | { ok: true }
  | { ok: false; error: string };
```

---

## Best Practices

### 1. Always Wait for SDK

```javascript
// ✅ Good
await waitForSDK();
const address = await window.mcj.wallet.getAddress();

// ❌ Bad
const address = await window.mcj.wallet.getAddress(); // May fail!
```

### 2. Handle All Error Cases

```javascript
// ✅ Good
const result = await window.mcj.wallet.getAddress();
if (!result.ok) {
  console.error('Failed:', result.error);
  return;
}

// ❌ Bad
const { address } = await window.mcj.wallet.getAddress(); // Crashes on error!
```

### 3. Request Minimum Permissions

```json
// ✅ Good - only what you need
"permissions": ["wallet", "username"]

// ❌ Bad - requesting everything
"permissions": ["wallet", "username", "camera", "location", "microphone"]
```

### 4. Show Loading States

```javascript
// ✅ Good
button.disabled = true;
button.textContent = 'Loading...';
const result = await window.mcj.wallet.sign(tx);
button.disabled = false;
button.textContent = 'Sign';
```

### 5. Cache Expensive Calls

```javascript
// ✅ Good
let cachedAddress = null;

async function getAddress() {
  if (cachedAddress) return cachedAddress;
  
  const result = await window.mcj.wallet.getAddress();
  if (result.ok) {
    cachedAddress = result.address;
  }
  return cachedAddress;
}
```
### 6. Optimize Performance
```javascript
// ✅ Good - Cache expensive calls
let cachedBalance = null;
let cacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function getBalance() {
  const now = Date.now();
  if (cachedBalance && (now - cacheTime) < CACHE_DURATION) {
    return cachedBalance;
  }
  
  const result = await window.mcj.wallet.getBalance();
  if (result.ok) {
    cachedBalance = result.balance;
    cacheTime = now;
  }
  return cachedBalance;
}

// ❌ Bad - Request every time
async function getBalance() {
  return await window.mcj.wallet.getBalance();
}
```

---

## Examples

See `QUICK_START.md` for complete working examples and tutorials.

## Support

- 📚 [Documentation](https://docs.mcjohnson.io)
- 💬 [Discord](https://discord.gg/mcjohnson)
- 📧 [Email](mailto:dev-support@mcjohnson.io)
- 🐛 [Issues](https://github.com/mcjohnson/miniapp-sdk/issues)
// TypeScript definitions for mini app developers
declare global {
  interface Window {
    mcj: McJohnsonSDK;
    MCJ_META: {
      appId: string;
      version: string;
    };
  }
}

export interface McJohnsonSDK {
  wallet: {
    getAddress(): Promise<{ ok: true; address: string } | { ok: false; error: string }>;
    getBalance(): Promise<{ ok: true; balance: string } | { ok: false; error: string }>;
    sign(tx: Transaction): Promise<{ ok: true; result: { signature: string; txHash: string } } | { ok: false; error: string }>;
  };
  
  user: {
    getUsername(): Promise<{ ok: true; username: string | null } | { ok: false; error: string }>;
  };
  
  camera: {
    open(options?: CameraOptions): Promise<CameraResponse>;
  };
  
  location: {
    get(): Promise<LocationResponse>;
  };
  
  storage: {
    save(path: string, data: string): Promise<{ ok: true; result: { uri: string } } | { ok: false; error: string }>;
  };
  
  notifications: {
    send(title: string, body: string): Promise<{ ok: true } | { ok: false; error: string }>;
  };
  
  permissions: {
    request(permission: string): Promise<{ ok: true } | { ok: false; error: string }>;
  };
}

export interface Transaction {
  to?: string;
  value?: string;
  data?: string;
  chainId: number;
  gasLimit?: string;
  nonce?: number;
  meta?: {
    transfer?: {
      to: string;
      amount: string;
    }
  };
}

export interface CameraOptions {
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export type CameraResponse = 
  | { ok: true; result: { canceled: false; assets: Array<{ uri: string; width: number; height: number; type: string; fileSize: number }> } }
  | { ok: false; error: string };

export type LocationResponse = 
  | { ok: true; location: { coords: { latitude: number; longitude: number; accuracy: number } } }
  | { ok: false; error: string };

export interface Manifest {
  name: string;
  version: string;
  entry: string;
  description: string;
  developer: string;
  permissions?: Permission[];
  punchline?: string;
  category?: string;
  icons?: { [size: string]: string };
  screenshots?: string[];
  website?: string;
  supportUrl?: string;
  termsUrl?: string;
  privacyUrl?: string;
}

export type Permission = 
  | "wallet"
  | "username"
  | "sign"
  | "camera"
  | "microphone"
  | "location"
  | "storage"
  | "notifications"
  | "contacts"
  | "biometrics";
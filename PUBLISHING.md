# Publishing Your Mini App

## Step 1: Package
```bash
npm run package my-app/ output.zip
```

## Step 2: Sign (Recommended)
```bash
# First time only
npm run sign gen-keys

# Sign your manifest
npm run sign sign manifest.json manifest.sig private.key
```

## Step 3: Publish to IPFS
```bash
npm run publish output.zip
# Returns: QmXXXXXXXXXXXXX...
```

## Step 4: Submit to Registry

Email: [Registry Team](mailto:esithole937@gmail.com)

Include:
- IPFS CID
- manifest.json
- manifest.sig
- public.key
- Screenshots
- Privacy policy URL

## Distribution

Users install via:
1. Explore tab → Enter CID
2. Registry (after approval)

// tools/publish-ipfs.js
// Simple HTTP-only version (no Helia dependencies needed)
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");

async function publish(filePath) {
  const apiUrl = process.env.IPFS_API || "https://ipfs.infura.io:5001";
  
  console.log("📤 Publishing to IPFS...");
  console.log(`Using API: ${apiUrl}\n`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), {
    filename: "miniapp.zip",
    contentType: "application/zip"
  });
  
  try {
    const response = await fetch(`${apiUrl}/api/v0/add`, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IPFS API error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    const cid = result.Hash;
    
    console.log(`✅ Published to IPFS`);
    console.log(`CID: ${cid}`);
    console.log(`Gateway URL: https://ipfs.io/ipfs/${cid}`);
    console.log(`\n💡 Tip: Pin this CID to keep it available permanently`);
    
    return cid;
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      console.error("\n❌ Cannot connect to IPFS API");
      console.error("\n💡 To publish to IPFS, you need an IPFS gateway. Options:");
      console.error("   1. Use Pinata (recommended): https://pinata.cloud");
      console.error("   2. Use Web3.Storage: https://web3.storage");
      console.error("   3. Run local IPFS node: https://docs.ipfs.tech");
      console.error("\nSet IPFS_API environment variable:");
      console.error("   export IPFS_API=https://api.pinata.cloud");
      console.error("   mcj publish dist.zip\n");
      throw error;
    }
    throw error;
  }
}

if (require.main === module) {
  const fp = process.argv[2];
  
  if (!fp) {
    console.error("Usage: mcj publish <file.zip>");
    console.error("\nEnvironment Variables:");
    console.error("  IPFS_API - IPFS HTTP API endpoint");
    console.error("             Default: https://ipfs.infura.io:5001");
    console.error("\nExamples:");
    console.error("  mcj publish dist.zip");
    console.error("  IPFS_API=https://api.pinata.cloud mcj publish dist.zip");
    process.exit(1);
  }
  
  publish(fp).catch((e) => {
    console.error("❌ Publish failed:", e.message);
    process.exit(1);
  });
}

module.exports = { publish };

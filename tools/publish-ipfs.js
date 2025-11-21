// tools/publish-ipfs.js
// Usage: node publish-ipfs.js out.zip
const fs = require("fs");
const { create } = require("ipfs-http-client");

async function publish(filePath) {
  const ipfs = create({ url: process.env.IPFS_API || "https://ipfs.infura.io:5001/api/v0" });
  const file = fs.readFileSync(filePath);
  const result = await ipfs.add({ path: "miniapp.zip", content: file });
  console.log("CID:", result.cid.toString());
  console.log("Gateway URL: https://ipfs.io/ipfs/" + result.cid.toString());
}

if (require.main === module) {
  const fp = process.argv[2];
  if (!fp) {
    console.error("provide file");
    process.exit(1);
  }
  publish(fp).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
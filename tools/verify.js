// tools/verify.js
// Usage: node verify.js manifest.json manifest.sig public.key

/* eslint-env node */
const nacl = require("tweetnacl");
const fs = require("fs");
const { Buffer } = require("buffer");

function verify(manifestPath, sigPath, pubPath) {
  const manifest = fs.readFileSync(manifestPath);
  const sig = Buffer.from(fs.readFileSync(sigPath, "utf8").trim(), "hex");
  const pub = Buffer.from(fs.readFileSync(pubPath, "utf8").trim(), "hex");
  return nacl.sign.detached.verify(new Uint8Array(manifest), new Uint8Array(sig), new Uint8Array(pub));
}

if (require.main === module) {
  const ok = verify(process.argv[2], process.argv[3], process.argv[4]);
  console.log("verified?", !!ok);
}
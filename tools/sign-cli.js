// tools/sign-cli.js
const fs = require("fs");
const nacl = require("tweetnacl");
const { Buffer } = require("buffer");

function genKeys() {
  const kp = nacl.sign.keyPair();
  fs.writeFileSync("public.key", Buffer.from(kp.publicKey).toString("hex"));
  fs.writeFileSync("private.key", Buffer.from(kp.secretKey).toString("hex"));
  console.log("✅ Keys written: public.key, private.key");
}

function sign(manifestPath, sigOut, privPath) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }
  if (!fs.existsSync(privPath)) {
    throw new Error(`Private key not found: ${privPath}`);
  }
  
  const manifest = fs.readFileSync(manifestPath);
  const priv = Buffer.from(fs.readFileSync(privPath, "utf8").trim(), "hex");
  const sig = nacl.sign.detached(new Uint8Array(manifest), new Uint8Array(priv));
  fs.writeFileSync(sigOut, Buffer.from(sig).toString("hex"));
  console.log(`✅ Signed → ${sigOut}`);
}

// Command line usage
if (require.main === module) {
  const cmd = process.argv[2];
  
  if (cmd === "gen-keys") {
    genKeys();
  } else if (cmd === "sign") {
    const manifestPath = process.argv[3];
    const sigOut = process.argv[4] || 'manifest.sig';
    const privPath = process.argv[5] || 'private.key';
    
    if (!manifestPath) {
      console.error("Usage: node sign-cli.js sign <manifest.json> [output.sig] [private.key]");
      process.exit(1);
    }
    
    try {
      sign(manifestPath, sigOut, privPath);
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  } else {
    console.log(`
Usage:
  node sign-cli.js gen-keys
  node sign-cli.js sign <manifest> <signature> <private-key>

Examples:
  node sign-cli.js gen-keys
  node sign-cli.js sign manifest.json manifest.sig private.key
    `);
  }
}

module.exports = { genKeys, sign };

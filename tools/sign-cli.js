
// tools/sign-cli.js
// Minimal CLI using tweetnacl (Ed25519) to gen keys and sign manifest.
// Usage: node sign-cli.js gen-keys
// node sign-cli.js sign manifest.json manifest.sig private.key

/* eslint-env node */
const fs = require("fs");
const nacl = require("tweetnacl");
const { Buffer } = require("buffer");

function genKeys() {
  const kp = nacl.sign.keyPair();
  fs.writeFileSync("public.key", Buffer.from(kp.publicKey).toString("hex"));
  fs.writeFileSync("private.key", Buffer.from(kp.secretKey).toString("hex"));
  console.log("keys written: public.key, private.key");
}

function sign(manifestPath, sigOut, privPath) {
  const manifest = fs.readFileSync(manifestPath);
  const priv = Buffer.from(fs.readFileSync(privPath, "utf8").trim(), "hex");
  const sig = nacl.sign.detached(new Uint8Array(manifest), new Uint8Array(priv));
  fs.writeFileSync(sigOut, Buffer.from(sig).toString("hex"));
  console.log("signed ->", sigOut);
}

const cmd = process.argv[2];
if (cmd === "gen-keys") genKeys();
if (cmd === "sign") sign(process.argv[3], process.argv[4], process.argv[5]);

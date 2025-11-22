// packager/package-miniapp.js
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

async function packageMiniApp(inputDir, outZip) {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }
  
  const manifestPath = path.join(inputDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("manifest.json is required");
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.name || !manifest.entry) {
    throw new Error("Manifest must have 'name' and 'entry' fields");
  }
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    output.on('close', () => {
      console.log(`Packaged ${archive.pointer()} bytes`);
      resolve();
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    archive.directory(inputDir, false);
    archive.finalize();
  });
}

if (require.main === module) {
  const inDir = process.argv[2];
  const out = process.argv[3] || "out.zip";
  
  if (!inDir) {
    console.error("Usage: node package-miniapp.js <input-dir> [output.zip]");
    process.exit(1);
  }
  
  packageMiniApp(inDir, out)
    .then(() => console.log("✅ Packaged:", out))
    .catch((e) => {
      console.error("❌ Error:", e.message);
      process.exit(1);
    });
}

module.exports = { packageMiniApp };
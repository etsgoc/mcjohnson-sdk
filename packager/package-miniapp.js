// packager/package-miniapp.js
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

async function packageMiniApp(inputDir, outZip) {
  if (!fs.existsSync(inputDir)) throw new Error("input not found");
  const manifestPath = path.join(inputDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error("manifest.json required");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.name || !manifest.entry) throw new Error("invalid manifest");

  const output = fs.createWriteStream(outZip);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(output);
  archive.directory(inputDir, false);
  await archive.finalize();
}

if (require.main === module) {
  const inDir = process.argv[2];
  const out = process.argv[3] || "out.zip";
  packageMiniApp(inDir, out)
    .then(() => console.log("packaged", out))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
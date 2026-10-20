import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "dist");
const pages = [
  "index.html",
  "image.html",
  "audio.html",
  "video.html",
  "document.html",
  "about.html",
  "contact.html",
  "app.js",
  "video-converter.js",
  "styles.css",
  "favicon.svg"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of pages) {
  await cp(join(root, file), join(output, file));
}

for (const [source, destination] of [
  ["@ffmpeg/ffmpeg/dist/esm", "vendor/ffmpeg"],
  ["@ffmpeg/core-mt/dist/esm", "vendor/ffmpeg-core-mt"]
]) {
  const sourceDirectory = join(root, "node_modules", source);
  const destinationDirectory = join(output, destination);
  await mkdir(destinationDirectory, { recursive: true });
  const entries = await readdir(sourceDirectory);
  for (const entry of entries) {
    if (/\.(?:js|wasm)$/.test(entry)) {
      await cp(join(sourceDirectory, entry), join(destinationDirectory, entry));
    }
  }
}

console.log(`Built Fileflow static site at ${output}`);

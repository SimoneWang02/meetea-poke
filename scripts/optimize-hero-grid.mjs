import { readdir, unlink, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const DIR = new URL("../public/images/hero_grid/", import.meta.url).pathname;
const MAX_DIM = 800;
const QUALITY = 80;

const files = await readdir(DIR);
const sources = files.filter((f) => /\.(jpe?g|png)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of sources) {
    const src = join(DIR, file);
    const baseName = basename(file, extname(file)).replace(/\s+/g, "_").replace(/[()]/g, "");
    const dst = join(DIR, `${baseName}.webp`);

    const before = (await stat(src)).size;
    totalBefore += before;

    await sharp(src)
        .rotate()
        .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(dst);

    const after = (await stat(dst)).size;
    totalAfter += after;

    if (src !== dst) {
        await unlink(src);
    }

    console.log(
        `${file.padEnd(28)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${basename(dst).padEnd(28)} ${(after / 1024).toFixed(0).padStart(6)} KB`,
    );
}

console.log(
    `\nTOTAL: ${(totalBefore / 1024).toFixed(0)} KB -> ${(totalAfter / 1024).toFixed(0)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% smaller)`,
);

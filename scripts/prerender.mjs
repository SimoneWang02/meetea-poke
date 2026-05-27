import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = process.env.PRERENDER_URL ?? 'https://meetea-poke.com';
const OUT_DIR = resolve('public/prerender');

const PAGES = [
    { path: '/',        file: 'home.html' },
    { path: '/ordina',  file: 'ordina.html' },
    { path: '/privacy', file: 'privacy.html' },
];

mkdirSync(OUT_DIR, { recursive: true });

console.log(`Prerendering da ${BASE_URL} …`);

const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const { path, file } of PAGES) {
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (compatible; PrerendererBot/1.0)',
    );
    try {
        await page.goto(BASE_URL + path, {
            waitUntil: 'networkidle0',
            timeout: 30_000,
        });
        // Aspetta che React abbia idratato il DOM
        await page.waitForSelector('#app > *', { timeout: 10_000 });
        const html = await page.content();
        writeFileSync(`${OUT_DIR}/${file}`, html, 'utf-8');
        console.log(`  ✓  ${path}  →  public/prerender/${file}`);
    } catch (err) {
        console.error(`  ✗  ${path}: ${err.message}`);
    }
    await page.close();
}

await browser.close();
console.log('Fatto. Esegui "git add public/prerender/" e fai deploy.');

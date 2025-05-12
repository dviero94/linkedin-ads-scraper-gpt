// main.js
import { PlaywrightCrawler, Dataset } from 'crawlee';

// Apri il dataset con le URL da visitare
const dataset = await Dataset.open('R8gJq9vyqg1n5GAWK'); // ID del dataset importato da CSV
const records = await dataset.getData();
const startUrls = records.items.map(item => item["LinkedIn Ads Library URL"]);

const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, log, pushData }) {
        log.info(`Scraping: ${request.url}`);
        await page.waitForLoadState('networkidle');

        const ads = await page.$$('div.ad-library-card'); // ogni ad

        for (const ad of ads) {
            const data = {
                "Ad format": await ad.evaluate(el => {
                    if (el.querySelector('video')) return 'video';
                    if (el.querySelector('img')) return 'image';
                    if (el.querySelector('iframe[src*=\"document\"]')) return 'document';
                    return 'unknown';
                }),
                "Advertiser name": await page.title().catch(() => ''),
                "Advertiser URL": request.url,
                "Headline": await ad.$eval('.ad-headline', el => el.innerText).catch(() => ''),
                "Body": await ad.$eval('.ad-body-text', el => el.innerText).catch(() => ''),
                "Call-to-action buttons": await ad.$eval('.ad-cta-button', el => el.innerText).catch(() => ''),
                "Click URL": await ad.$eval('a.ad-click-url', el => el.href).catch(() => ''),
                "Image URL for image ads": await ad.$eval('img', el => el.src).catch(() => ''),
                "Video URL for video ads": await ad.$eval('video', el => el.src).catch(() => ''),
                "Document URL for document ads": await ad.$eval('iframe[src*=\"document\"]', el => el.src).catch(() => ''),
                "Time period when the ad has been active": await ad.$eval('.ad-run-time', el => el.innerText).catch(() => ''),
                "Total impressions": await ad.$eval('.ad-impressions-total', el => el.innerText).catch(() => ''),
                "Impressions per country": await ad.$$eval('.ad-country-impressions', els => els.map(e => e.innerText).join('; ')).catch(() => ''),
            };
            await pushData(data);
        }
    },
    maxRequestsPerCrawl: 1000,
});

// Avvia lo scraping con le URL raccolte
await crawler.run(startUrls);

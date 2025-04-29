import { PlaywrightCrawler } from 'crawlee';

// This scraper loads the Booking.com page, performs a series of interactions
// (selecting dates, applying sorting and filters), and then extracts hotel information
// based on specific CSS selectors. The extracted data (hotel name, price, and URL)
// is returned back to the main function.
export class BookingScraper {
    constructor(city, checkinDate, checkoutDate) {
        this.city = city;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
    }

    async scrape() {
        const results = [];
        const checkinDate = this.checkinDate;
        const checkoutDate = this.checkoutDate;

        const url = `https://www.booking.com/searchresults.en-gb.html?ss=${this.city}&lang=en-gb&ac_langcode=en&search_selected=true&checkin_date=${checkinDate}&checkout_date=${checkoutDate}&group_adults=2&no_rooms=1&group_children=1&age=2&nflt=class%3D5&order=price&selected_currency=INR`;

        const crawler = new PlaywrightCrawler({
            maxConcurrency: 1,
            launchContext: {
                launchOptions: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-gpu',
                      ],
                },   
            },
            async requestHandler({ page }) {
                console.log(`Staring scraping ${url}`)
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

                try {
                    await page.waitForSelector('[data-testid="searchbox-dates-container"]');
                    await page.waitForTimeout(5000);
                    await page.click('[data-testid="searchbox-dates-container"]');
                    await page.waitForTimeout(1000);
                    await page.click('[data-testid="searchbox-dates-container"]');
                    await page.waitForTimeout(1000);
                    await page.waitForSelector('span[data-date]', { timeout: 1000 });
                    await page.click(`span[data-date="${checkinDate}"]`);
                    await page.waitForTimeout(1000);
                    await page.click(`span[data-date="${checkoutDate}"]`);
                    await page.waitForTimeout(1000);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(10000);
                    await page.click('[data-testid="sorters-dropdown-trigger"]');
                    await page.waitForTimeout(1000);
                    await page.click('button[aria-label="Price (lowest first)"]');
                    await page.waitForTimeout(5000);
                    await page.click('input[aria-label^="5 stars"]');
                    await page.waitForTimeout(5000);
                } catch (e) {}

                await page.waitForSelector('[data-testid="property-card"]', { timeout: 30000 });

                const hotelsOnPage = await page.$$eval('[data-testid="property-card"]', hotelCards =>
                    hotelCards.map(hotel => {
                        const name = hotel.querySelector('[data-testid="title"]')?.innerText || 'No name';
                        const priceText = hotel.querySelector('[data-testid="price-and-discounted-price"]')?.innerText
                            || hotel.querySelector('[data-testid="price"]')?.innerText
                            || hotel.querySelector('.fcab3ed991.bd73d13072')?.innerText || '';
                        const price = priceText.replace(/[₹,Rs.\s]/g, '') ? parseFloat(priceText.replace(/[₹,Rs.\s]/g, '')) : null;
                        const url = hotel.querySelector('a')?.href || '';
                        return { name, price, site: 'Booking.com', url };
                    })
                );
                results.push(...hotelsOnPage);
            },
        });

        await crawler.run([url]);
        console.log(`Completed Booking.com scraper - ${results.length} hotels found`);
        return results;
    }
}

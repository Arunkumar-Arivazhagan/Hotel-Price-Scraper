import { PlaywrightCrawler } from 'crawlee';

// This scraper makes a call to the MakeMyTrip URL, waits for the page to load fully,
// extracts hotel information based on specific CSS selectors,
// and returns the data (hotel name, price, and URL) back to the main function.

export class MakeMyTripScraper {
    constructor(city, checkinDate, checkoutDate) {
        this.city = city;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
    }

    async scrape() {
        const results = [];
        const checkinDate = this.checkinDate;
        const checkoutDate = this.checkoutDate;

        const url = `https://www.makemytrip.com/hotels/hotel-listing/?_uCurrency=INR&checkin=${checkinDate}&checkout=${checkoutDate}&city=CTMAA&country=IN&filterData=STAR_RATING%7C5&locusId=CTMAA&locusType=city&roomStayQualifier=2e1e2e&sort=price-asc&searchText=${this.city}`;
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

                await page.waitForSelector('.listingRowOuter.hotelTileDt.makeRelative', { timeout: 30000 });
                const hotelsOnPage = await page.$$eval('.listingRowOuter.hotelTileDt.makeRelative', hotelCards =>
                    hotelCards.map(hotel => {
                        const name = hotel.querySelector('p#hlistpg_hotel_name span')?.innerText || 'No name';
                        const priceElement = hotel.querySelector('#hlistpg_hotel_shown_price');
                        const price = priceElement ? parseFloat(priceElement.innerText.replace(/[₹,Rs.]/g, '').trim()) : null;
                        const url = hotel.querySelector('a') ? `https:${hotel.querySelector('a').getAttribute('href')}` : '';
                        return { name, price, site: 'MakeMyTrip.com', url };
                    })
                );
                results.push(...hotelsOnPage);
            },
        });

        await crawler.run([url]);
        console.log(`Completed MakeMyTrip.com scraper - ${results.length} hotels found`);
        return results;
    }
}

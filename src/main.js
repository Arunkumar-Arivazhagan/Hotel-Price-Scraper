import { HotelPriceFinder } from './HotelPriceFinder.js';
import fs from 'fs/promises';
import path from 'path';

// This is the entry point of the Hotel Price Scraper project.
// It initializes the HotelPriceFinder, triggers the scraping process for the given city,
// and logs the lowest priced 5-star hotel(s) with their details to the console.
async function main() {
    const finder = new HotelPriceFinder();
    const city = 'Chennai';

    try {
        const results = await finder.findLowestPrice(city);
        console.log("Lowest priced 5-star hotels for 5 nights:");
        results.forEach((hotel, index) => {
            console.log(`Hotel ${index + 1}:`);
            console.log(`  Name: ${hotel.name}`);
            console.log(`  Price: ₹${hotel.price}`);
            console.log(`  Site: ${hotel.site}`);
            console.log(`  URL: ${hotel.url}`);
        });
        console.log('Crawler finished.');
    } catch (err) {
        console.error("Error finding hotel prices:", err);
    }
}

main();
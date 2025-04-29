import {MakeMyTripScraper} from './scraper/MakeMyTripScraper.js';
import {BookingScraper} from './scraper/BookingScraper.js';

function getDates() {
    const today = new Date();
    const checkinDate = new Date(today.setDate(today.getDate() + 2));
    const checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkinDate.getDate() + 5);

    const checkinMakeMyTrip = (checkinDate.getMonth() + 1).toString().padStart(2, '0') + checkinDate.getDate().toString().padStart(2, '0') + checkinDate.getFullYear();
    const checkoutMakeMyTrip = (checkoutDate.getMonth() + 1).toString().padStart(2, '0') + checkoutDate.getDate().toString().padStart(2, '0') + checkoutDate.getFullYear();

    const checkinBooking = checkinDate.toISOString().split('T')[0];
    const checkoutBooking = checkoutDate.toISOString().split('T')[0];
    return { checkinMakeMyTrip, checkoutMakeMyTrip, checkinBooking, checkoutBooking };
}

export class HotelPriceFinder {
    async findLowestPrice(city) {
        const { checkinMakeMyTrip, checkoutMakeMyTrip, checkinBooking, checkoutBooking } = getDates();

        const mmtScraper = new MakeMyTripScraper(city, checkinMakeMyTrip, checkoutMakeMyTrip);
        const bookingScraper = new BookingScraper(city, checkinBooking, checkoutBooking);

        let mmtHotels = [];
        try {
            mmtHotels = await mmtScraper.scrape();
        } catch (error) {
            console.error("Error scraping MakeMyTrip:", error);
        }

        let bookingHotels = [];
        try {
            bookingHotels = await bookingScraper.scrape();
        } catch (error) {
            console.error("Error scraping Booking.com:", error);
        }

        const allHotels = [...mmtHotels, ...bookingHotels].filter(hotel => typeof hotel.price === 'number');

        allHotels.sort((a, b) => a.price - b.price);

        const minPrice = allHotels[0]?.price;
        return allHotels.filter(hotel => hotel.price === minPrice);
    }
}
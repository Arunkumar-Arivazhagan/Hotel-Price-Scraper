# 🏨 Hotel Price Scraper

This project scrapes **5-star hotel prices** from **Booking.com** and **MakeMyTrip.com** for a specified city and stay duration.

It uses:
- **Node.js 20**
- **Playwright** (for browser automation)
- **Crawlee** (for scalable crawling)

You can run this project either **locally** or inside a **Docker container**.

---

## 🚀 Features
- Automatically sets check-in/check-out dates (2 days from today, 5-night stay).
- Scrapes 5-star hotels only.
- Sorts results by **lowest price**.
- Combines results from **Booking.com** and **MakeMyTrip**.
- Displays the lowest priced hotel(s) across platforms.

---

## 🛠️ Local Installation (without Docker)

### 1. Install Node.js (v20)

If Node.js is not installed, install it:

#### On macOS (with Homebrew):
```bash
brew install node@20
brew link --overwrite node@20
```

#### On Ubuntu/Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### On Windows:
- Download and install from [Node.js official website](https://nodejs.org/en/download/).

---

### 2. Install project dependencies

Clone the repository and install the required libraries:

```bash
git clone https://github.com/Arunkumar-Arivazhagan/Hotel-Price-Scraper.git
cd hotel-price-scraper
npm install
npx playwright install
```

---

### 3. Run the scraper locally

```bash
npm start
```

👉 This will scrape 5-star hotels for **Chennai** by default and show the lowest priced ones.

#### Sample Output:
```
Lowest priced 5-star hotels for 5 nights:
Hotel 1:
  Name: Turyaa Chennai - OMR
  Price: ₹3891
  Site: MakeMyTrip.com
  URL: https://www.makemytrip.com/hotels/hotel-details?hotelId=201507071459388185&_uCurrency=INR&checkin=04302025&checkout=05052025&city=CTMAA&country=IN&filterData=STAR_RATING%7C5&lat=12.97347&lng=80.25078&locusId=CTMAA&locusType=city&rank=1&roomStayQualifier=2e1e2e&searchText=Chennai&sort=price-asc&mtkeys=undefined
```

---

## 🐳 Running with Docker

If you prefer running inside Docker, follow these steps:

### 1. Install Docker and Docker Compose

- [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) (for macOS/Windows)
- On Linux:
  ```bash
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
  ```

Check installation:

```bash
docker --version
docker compose version
```

---

### 2. Build and Run the Docker container

From the project directory:

```bash
docker compose up --build
```

👉 This will:
- Build the Docker image
- Start the container
- Automatically run the scraper and output results

To run it **in the background (detached mode)**:

```bash
docker compose up --build -d
```

To stop the container:

```bash
docker compose down
```

---

## 📂 Project Structure

```
hotel-price-scraper/
│
├── src/
│   ├── main.js              # Entry point
│   ├── HotelPriceFinder.js   # Logic to find the lowest price
│   └── scraper/
│       ├── BookingScraper.js     # Scraper for Booking.com
│       └── MakeMyTripScraper.js  # Scraper for MakeMyTrip
│
├── package.json             # Node dependencies
├── Dockerfile               # Docker build instructions
├── docker-compose.yml       # Docker services definition
└── README.md                # Project documentation
```

---

## ⚡ Notes
- The scraper uses **Playwright** with `{ headless: false }` — it will try to open a real browser window inside Docker. If you run into issues, consider setting it to `{ headless: true }` for server environments.
- Crawling Booking.com and MakeMyTrip too aggressively can trigger bot protections. Use responsibly!

---

## 📞 Contact
For any issues or questions, feel free to open an Issue or reach out!

---


# Weather Logger — Node.js

A beginner-friendly Node.js project that fetches real-time weather data for **Vehari, Pakistan** from the [Open-Meteo API](https://open-meteo.com/), logs it to a file, and serves a clean dashboard via a built-in HTTP server.

---

## Table of Contents

- [Features](#features)
- [Concepts Demonstrated](#concepts-demonstrated)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Usage](#installation--usage)
- [Screenshots](#screenshots)
- [API Reference](#api-reference)
- [Author](#author)
- [License](#license)

---

## Features

- Fetches **live weather data** (temperature, wind speed, wind direction, weather code) from the Open-Meteo API
- Logs the weather report to a local `weather_log.txt` file
- Serves a **responsive web dashboard** on `http://localhost:3000`
- Uses **inline SVG icons** (no emoji) for a professional look
- Collapsible raw log viewer built into the UI
- **No API key required** — uses the free Open-Meteo service

---

## Concepts Demonstrated

| #  | Concept                      | Where It's Used                                   |
|----|------------------------------|---------------------------------------------------|
| 1  | NPM & Third-Party Modules   | `axios` for HTTP requests                         |
| 2  | Asynchronous Promises        | `async/await` pattern in `fetchWeather()`         |
| 3  | `fs` Core Module             | `fs.writeFile()` and `fs.readFile()` for file I/O |
| 4  | `http` Core Module           | Built-in web server on port 3000                  |
| 5  | The Event Loop               | Explained via inline comments throughout the code |

---

## Tech Stack

| Technology   | Purpose                          |
|-------------|----------------------------------|
| Node.js     | Runtime environment              |
| Axios       | Promise-based HTTP client        |
| Open-Meteo  | Free weather API (no key needed) |
| HTML / CSS  | Dashboard UI (served inline)     |

---

## Project Structure

```
weather-logger/
├── app.js              # Main application file (server + logic)
├── package.json        # Project metadata & dependencies
├── weather_log.txt     # Auto-generated weather log file
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

---

## Prerequisites

- **Node.js** v14 or higher — [Download here](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- An active internet connection (to fetch weather data)

---

## Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZainDevX/Zain-FA23-BSE-047.git
   cd Zain-FA23-BSE-047
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Screenshots

> The dashboard displays a hero card with the current temperature, metric cards for wind data, and a collapsible raw log section.

---

## API Reference

This project uses the **Open-Meteo** forecast API.

| Parameter         | Value                |
|-------------------|----------------------|
| Endpoint          | `https://api.open-meteo.com/v1/forecast` |
| Latitude          | `30.04` (Vehari)     |
| Longitude         | `72.35` (Vehari)     |
| Data Requested    | `current_weather=true` |
| Authentication    | None required        |

**Sample Response Fields:**

| Field            | Description                  | Example        |
|------------------|------------------------------|----------------|
| `temperature`    | Current temperature in °C    | `22.5`         |
| `windspeed`      | Wind speed in km/h           | `12.2`         |
| `winddirection`  | Wind direction in degrees    | `317`          |
| `weathercode`    | WMO weather interpretation   | `3`            |
| `time`           | Observation timestamp        | `2026-02-13T04:00` |

---

## Author

- **Name:** Zain
- **Roll No:** FA23-BSE-047
- **Course:** Advanced Web Technologies — Semester 6
- **GitHub:** [ZainDevX](https://github.com/ZainDevX)

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

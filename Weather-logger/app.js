// =============================================================================
// 🌤️  NODE.JS WEATHER LOGGER — Beginner Project
// =============================================================================
// This single file demonstrates:
//   1. NPM & third-party modules  (axios)
//   2. Asynchronous Promises       (fetching data from an API)
//   3. The 'fs' core module        (writing & reading files)
//   4. The 'http' core module      (creating a web server)
//   5. The Event Loop              (explained in comments throughout)
// =============================================================================

// -----------------------------------------------------------------------------
// 📦  IMPORTS — Core Modules & Third-Party Packages
// -----------------------------------------------------------------------------
// 'http' and 'fs' ship with Node.js — no installation needed.
// 'axios' was installed via NPM (npm install axios) and lives in node_modules/.
// -----------------------------------------------------------------------------
const http = require("http");
const fs = require("fs");
const axios = require("axios");

// -----------------------------------------------------------------------------
// ⚙️  CONFIGURATION
// -----------------------------------------------------------------------------
const PORT = 3000;
const LOG_FILE = "weather_log.txt";

// Open-Meteo is a free, no-API-key-needed weather service.
// We request the current temperature for Vehari, Pakistan (lat/lon).
const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=30.04&longitude=72.35&current_weather=true";

// -----------------------------------------------------------------------------
// 🔄  EVENT LOOP PRIMER (for the instructor to explain)
// -----------------------------------------------------------------------------
// Node.js runs on a SINGLE thread.  It uses an Event Loop to handle many tasks
// concurrently without blocking.  Here is the simplified flow:
//
//   1. Node reads this file top-to-bottom and registers callbacks / promises.
//   2. Synchronous code runs immediately on the Call Stack.
//   3. Async operations (HTTP requests, file I/O) are handed off to the OS or
//      the libuv thread pool so the main thread is NEVER blocked.
//   4. When an async operation completes, its callback is placed in a queue.
//   5. The Event Loop picks callbacks from the queue and executes them on the
//      Call Stack — one at a time.
//
// This is why Node.js can serve thousands of requests even though it is
// single-threaded: it never waits (blocks) for I/O to finish.
// -----------------------------------------------------------------------------

// =============================================================================
// 1️⃣  FETCH WEATHER DATA  (axios + Promises / async-await)
// =============================================================================

/**
 * fetchWeather()
 *
 * Uses axios (a Promise-based HTTP client) to call the Open-Meteo API.
 * - axios.get() returns a PROMISE, so this is non-blocking.
 * - The Event Loop registers the network request and moves on.
 * - When the response arrives, the .then() / await continuation runs.
 *
 * @returns {Promise<string>}  A formatted string of weather information.
 */
async function fetchWeather() {
  // EVENT LOOP NOTE:
  // axios.get() initiates an HTTP request that is handled by the OS networking
  // layer.  Node's main thread does NOT sit idle waiting for the response —
  // it is free to process other events (like incoming server requests).
  // The 'await' keyword pauses ONLY this function, not the entire process.
  console.log("[...] Fetching weather data from Open-Meteo API...");

  const response = await axios.get(WEATHER_API_URL);
  const weather = response.data.current_weather;

  // Build a human-readable report
  const report = [
    "========================================",
    "  Weather Report — Vehari, Pakistan",
    "========================================",
    `  Time         : ${weather.time}`,
    `  Temperature  : ${weather.temperature} °C`,
    `  Wind Speed   : ${weather.windspeed} km/h`,
    `  Wind Dir.    : ${weather.winddirection}°`,
    `  Weather Code : ${weather.weathercode}`,
    "========================================",
    `  Report generated: ${new Date().toLocaleString()}`,
    "========================================",
  ].join("\n");

  console.log("[OK] Weather data received!\n");
  return report;
}

// =============================================================================
// 2️⃣  SAVE TO FILE  (fs core module — asynchronous)
// =============================================================================

/**
 * saveToFile(data)
 *
 * Uses fs.writeFile() — the ASYNC version — to write data to disk.
 * - This is non-blocking: Node hands the write operation to the libuv
 *   thread pool and immediately returns to the Event Loop.
 * - The callback fires once the OS confirms the write is complete.
 *
 * We wrap it in a Promise so we can use async/await for cleaner flow control.
 *
 * @param {string} data  The text to write.
 * @returns {Promise<void>}
 */
function saveToFile(data) {
  return new Promise((resolve, reject) => {
    // EVENT LOOP NOTE:
    // fs.writeFile() is offloaded to libuv's thread pool (default 4 threads).
    // The main thread registers the callback and continues executing other
    // code.  When the file write finishes, the callback is pushed onto the
    // Event Loop's I/O callback queue and eventually executed.
    console.log(`[...] Writing weather data to "${LOG_FILE}"...`);

    fs.writeFile(LOG_FILE, data, "utf8", (err) => {
      if (err) {
        console.error("[ERR] Error writing file:", err.message);
        return reject(err);
      }
      console.log(`[OK] Data saved to "${LOG_FILE}" successfully!\n`);
      resolve();
    });
  });
}

// =============================================================================
// 3️⃣  CREATE HTTP SERVER  (http core module)
// =============================================================================

/**
 * buildHTML(fileData)
 *
 * Generates the full HTML page for the weather dashboard.
 * Separated into its own function for clarity.
 *
 * @param {string} fileData  The raw weather log text.
 * @returns {string}  Complete HTML document.
 */
function buildHTML(fileData) {
  // Parse the weather data from the log file
  var lines = fileData.split("\n").filter(function (l) {
    return l.trim() && !l.includes("===");
  });
  var time = "", temp = "", wind = "", windDir = "", code = "", generated = "";
  lines.forEach(function (line) {
    if (line.includes("Time"))        time = line.split(":").slice(1).join(":").trim();
    if (line.includes("Temperature")) temp = line.split(":").slice(1).join(":").trim();
    if (line.includes("Wind Speed"))  wind = line.split(":").slice(1).join(":").trim();
    if (line.includes("Wind Dir"))    windDir = line.split(":").slice(1).join(":").trim();
    if (line.includes("Weather Code"))code = line.split(":").slice(1).join(":").trim();
    if (line.includes("generated"))   generated = line.split(":").slice(1).join(":").trim();
  });

  var html = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>Weather Logger — Vehari</title>',
    '  <link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css" />',
    '  <style>',
    '    .icon-svg { width: 20px; height: 20px; vertical-align: middle; margin-right: 6px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }',
    '    .icon-svg.hero-icon { width: 24px; height: 24px; }',
    '    .icon-svg.nav-icon { width: 22px; height: 22px; stroke: #94a3b8; }',
    '    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
    '    body {',
    '      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;',
    '      background: #f0f4f8;',
    '      color: #1a202c;',
    '      min-height: 100vh;',
    '      display: flex;',
    '      flex-direction: column;',
    '    }',
    '    .navbar {',
    '      background: #1e293b;',
    '      color: #f1f5f9;',
    '      padding: 0.85rem 2rem;',
    '      display: flex;',
    '      align-items: center;',
    '      justify-content: space-between;',
    '      box-shadow: 0 2px 8px rgba(0,0,0,0.15);',
    '    }',
    '    .navbar .brand {',
    '      font-size: 1.15rem;',
    '      font-weight: 600;',
    '      letter-spacing: 0.3px;',
    '      display: flex;',
    '      align-items: center;',
    '      gap: 0.5rem;',
    '    }',
    '    .navbar .badge {',
    '      background: #0ea5e9;',
    '      color: #fff;',
    '      font-size: 0.65rem;',
    '      padding: 2px 8px;',
    '      border-radius: 9999px;',
    '      font-weight: 700;',
    '      text-transform: uppercase;',
    '      letter-spacing: 0.5px;',
    '    }',
    '    .container {',
    '      flex: 1;',
    '      max-width: 720px;',
    '      width: 100%;',
    '      margin: 2rem auto;',
    '      padding: 0 1.25rem;',
    '    }',
    '    .hero {',
    '      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);',
    '      color: #fff;',
    '      border-radius: 14px;',
    '      padding: 2.25rem 2.5rem;',
    '      margin-bottom: 1.5rem;',
    '      position: relative;',
    '      overflow: hidden;',
    '    }',
    '    .hero::after {',
    '      content: "";',
    '      position: absolute;',
    '      top: -40px; right: -40px;',
    '      width: 160px; height: 160px;',
    '      background: rgba(14,165,233,0.12);',
    '      border-radius: 50%;',
    '    }',
    '    .hero .location {',
    '      font-size: 0.8rem;',
    '      text-transform: uppercase;',
    '      letter-spacing: 1.5px;',
    '      color: #94a3b8;',
    '      margin-bottom: 0.25rem;',
    '    }',
    '    .hero .city {',
    '      font-size: 1.5rem;',
    '      font-weight: 700;',
    '      margin-bottom: 1.25rem;',
    '    }',
    '    .hero .temp-row {',
    '      display: flex;',
    '      align-items: flex-end;',
    '      gap: 0.75rem;',
    '    }',
    '    .hero .temp {',
    '      font-size: 3.5rem;',
    '      font-weight: 300;',
    '      line-height: 1;',
    '    }',
    '    .hero .temp-label {',
    '      font-size: 0.85rem;',
    '      color: #cbd5e1;',
    '      margin-bottom: 0.45rem;',
    '    }',
    '    .metrics {',
    '      display: grid;',
    '      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));',
    '      gap: 1rem;',
    '      margin-bottom: 1.5rem;',
    '    }',
    '    .metric-card {',
    '      background: #fff;',
    '      border-radius: 12px;',
    '      padding: 1.35rem 1.5rem;',
    '      box-shadow: 0 1px 4px rgba(0,0,0,0.06);',
    '      border: 1px solid #e2e8f0;',
    '      transition: box-shadow 0.2s;',
    '    }',
    '    .metric-card:hover {',
    '      box-shadow: 0 4px 12px rgba(0,0,0,0.1);',
    '    }',
    '    .metric-card .label {',
    '      font-size: 0.72rem;',
    '      text-transform: uppercase;',
    '      letter-spacing: 1px;',
    '      color: #64748b;',
    '      margin-bottom: 0.5rem;',
    '    }',
    '    .metric-card .value {',
    '      font-size: 1.55rem;',
    '      font-weight: 600;',
    '      color: #0f172a;',
    '    }',
    '    .metric-card .icon-svg {',
    '      width: 22px;',
    '      height: 22px;',
    '      margin-right: 0.4rem;',
    '      vertical-align: middle;',
    '      color: #0ea5e9;',
    '    }',
    '    .log-section {',
    '      background: #fff;',
    '      border-radius: 12px;',
    '      border: 1px solid #e2e8f0;',
    '      overflow: hidden;',
    '      margin-bottom: 1.5rem;',
    '    }',
    '    .log-header {',
    '      padding: 1rem 1.5rem;',
    '      font-size: 0.82rem;',
    '      font-weight: 600;',
    '      text-transform: uppercase;',
    '      letter-spacing: 0.8px;',
    '      color: #475569;',
    '      background: #f8fafc;',
    '      border-bottom: 1px solid #e2e8f0;',
    '      cursor: pointer;',
    '      user-select: none;',
    '      display: flex;',
    '      justify-content: space-between;',
    '      align-items: center;',
    '    }',
    '    .log-header:hover { background: #f1f5f9; }',
    '    .log-header .arrow { transition: transform 0.2s; }',
    '    .log-body {',
    '      max-height: 0;',
    '      overflow: hidden;',
    '      transition: max-height 0.3s ease;',
    '    }',
    '    .log-body.open { max-height: 400px; }',
    '    .log-body pre {',
    '      margin: 0;',
    '      padding: 1.25rem 1.5rem;',
    '      background: #f8fafc;',
    '      font-family: "Cascadia Code", "Fira Code", Consolas, monospace;',
    '      font-size: 0.82rem;',
    '      line-height: 1.7;',
    '      color: #334155;',
    '      overflow-x: auto;',
    '    }',
    '    .site-footer {',
    '      text-align: center;',
    '      padding: 1.25rem;',
    '      font-size: 0.75rem;',
    '      color: #94a3b8;',
    '      border-top: 1px solid #e2e8f0;',
    '      background: #fff;',
    '    }',
    '    .site-footer span { color: #64748b; font-weight: 500; }',
    '    .refresh-btn {',
    '      display: inline-flex;',
    '      align-items: center;',
    '      gap: 0.4rem;',
    '      background: #0ea5e9;',
    '      color: #fff;',
    '      border: none;',
    '      padding: 0.6rem 1.4rem;',
    '      border-radius: 8px;',
    '      font-size: 0.82rem;',
    '      font-weight: 600;',
    '      cursor: pointer;',
    '      transition: background 0.2s;',
    '      text-decoration: none;',
    '    }',
    '    .refresh-btn:hover { background: #0284c7; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <nav class="navbar">',
    '    <div class="brand"><svg class="icon-svg nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg> Weather Logger</div>',
    '    <div class="badge"><svg style="width:10px;height:10px;vertical-align:middle;margin-right:3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" stroke="none"><circle cx="12" cy="12" r="6"/></svg>Live</div>',
    '  </nav>',
    '  <main class="container">',
    '    <div class="hero">',
    '      <div class="location">Current Weather</div>',
    '      <div class="city"><svg class="icon-svg hero-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> Vehari, Pakistan</div>',
    '      <div class="temp-row">',
    '        <div class="temp">' + temp + '</div>',
    '        <div class="temp-label">Observed at ' + time + '</div>',
    '      </div>',
    '    </div>',
    '    <div class="metrics">',
    '      <div class="metric-card">',
    '        <div class="label">Wind Speed</div>',
    '        <div class="value"><svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>' + wind + '</div>',
    '      </div>',
    '      <div class="metric-card">',
    '        <div class="label">Wind Direction</div>',
    '        <div class="value"><svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' + windDir + '</div>',
    '      </div>',
    '      <div class="metric-card">',
    '        <div class="label">Weather Code</div>',
    '        <div class="value"><svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' + code + '</div>',
    '      </div>',
    '      <div class="metric-card">',
    '        <div class="label">Report Generated</div>',
    '        <div class="value" style="font-size:1rem;">' + generated + '</div>',
    '      </div>',
    '    </div>',
    '    <div style="text-align:center; margin-bottom:1.5rem;">',
    '      <a href="/" class="refresh-btn"><svg style="width:16px;height:16px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Refresh Data</a>',
    '    </div>',
    '    <div class="log-section">',
    '      <div class="log-header" onclick="var b=this.nextElementSibling;b.classList.toggle(\'open\');this.querySelector(\'.arrow\').style.transform=b.classList.contains(\'open\')?\'rotate(90deg)\':\'\';">',
    '        <svg style="width:16px;height:16px;vertical-align:middle;margin-right:6px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>Raw Log Output <span class="arrow">&#9654;</span>',
    '      </div>',
    '      <div class="log-body">',
    '        <pre>' + fileData + '</pre>',
    '      </div>',
    '    </div>',
    '  </main>',
    '  <div class="site-footer">',
    '    Served by <span>Node.js http</span> module &bull;',
    '    Data from <span>Open-Meteo API</span> &bull;',
    '    No API key required',
    '  </div>',
    '</body>',
    '</html>'
  ].join("\n");

  return html;
}

/**
 * startServer()
 *
 * Uses the built-in 'http' module to create a web server on PORT 3000.
 * - The server listens for incoming requests — this is EVENT-DRIVEN.
 * - Each request triggers the callback; the Event Loop dispatches it.
 * - Inside the callback we use fs.readFile() (async) to read the log file
 *   so the server is NEVER blocked while reading from disk.
 */
function startServer() {
  const server = http.createServer((req, res) => {
    // EVENT LOOP NOTE:
    // This callback runs each time a client connects.  Because Node.js is
    // event-driven, it can handle many connections without creating a new
    // thread for each one.  The Event Loop simply calls this function
    // whenever a 'request' event is emitted.

    // Only respond to the root route; ignore favicon requests, etc.
    if (req.url === "/") {
      // EVENT LOOP NOTE:
      // fs.readFile() is asynchronous.  The read operation is sent to the
      // libuv thread pool.  While the file is being read, the Event Loop
      // is free to accept and process OTHER incoming HTTP requests.
      fs.readFile(LOG_FILE, "utf8", (err, fileData) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error: Could not read weather log file.");
          return;
        }

        const html = buildHTML(fileData);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 — Not Found");
    }
  });

  // EVENT LOOP NOTE:
  // server.listen() is non-blocking.  Node registers the server socket with
  // the OS and returns immediately.  The Event Loop then waits for incoming
  // connection events — this is what keeps the process alive.
  server.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log("[OK] Server is running at http://localhost:" + PORT);
    console.log("=".repeat(50));
    console.log("\n[i] Open the URL above in your browser to view the weather!");
    console.log("   Press Ctrl + C to stop the server.\n");
  });
}

// =============================================================================
// 4️⃣  MAIN — Orchestrate everything with async/await
// =============================================================================

/**
 * main()
 *
 * This is our entry point.  We use async/await to run the steps in order:
 *   1. Fetch weather data   (network I/O — non-blocking)
 *   2. Save it to a file    (disk I/O    — non-blocking)
 *   3. Start the server     (event-driven listener)
 *
 * Even though these steps look sequential, NONE of them block the Event Loop.
 * 'await' only pauses *this* async function — the Event Loop keeps spinning
 * and can handle other tasks (timers, I/O callbacks, etc.) in the meantime.
 */
async function main() {
  console.log("\n--- Node.js Weather Logger — Starting up... ---\n");

  try {
    // Step 1 — Fetch
    const weatherReport = await fetchWeather();
    console.log(weatherReport);

    // Step 2 — Save
    await saveToFile(weatherReport);

    // Step 3 — Serve
    startServer();
  } catch (error) {
    console.error("[ERR] Something went wrong:", error.message);
    process.exit(1);
  }
}

// EVENT LOOP NOTE:
// Calling main() pushes the function onto the Call Stack.  Because it is async,
// it returns a Promise immediately.  The Event Loop then starts processing
// the queued microtasks (Promise continuations) and I/O callbacks, keeping the
// application responsive at every stage.
main();

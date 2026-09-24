# Prop Firm Operations & Risk Dashboard

A small front-end dashboard that models three things a trader support team deals with every day: monitoring a data feed, explaining trailing drawdown rules, and walking through common support tickets.

**Live demo:** https://dereknnguyen.github.io/dashboard-project/

## Features

### 1. API Feed Monitor
- Fetches USD/EUR and USD/GBP reference rates from the [Frankfurter API](https://frankfurter.dev) (European Central Bank data) using `fetch` and `async/await`.
- Converts the rates into index-style point values for display.
- Shows a connection status indicator (green when synced, red on error) and retries on a timer.
- Handles failures gracefully: non-200 responses and unexpected payloads trigger the error state instead of breaking the page.

### 2. Trailing Drawdown Simulator
- Enter a starting balance and a simulated peak balance to see the trailing drawdown threshold and the loss buffer remaining.
- The threshold trails the peak balance and locks once it reaches the starting balance.
- The loss figure turns red when the remaining buffer gets low.
- Recalculates instantly on input.

### 3. Support Scenario Sandbox
- Simulates the diagnostic flow for common trader tickets, such as a laggy chart or a failed platform authentication.
- Each scenario outputs a suggested resolution, the way a support agent would document troubleshooting steps for a customer.

## Tech Stack

- HTML5, CSS3
- Vanilla JavaScript (no frameworks or build step)
- Frankfurter REST API
- Hosted on GitHub Pages

## Project Structure

```
dashboard-project/
├── index.html    # Page layout and dashboard cards
├── style.css     # Styling
├── app.js        # API polling, drawdown logic, support console
└── README.md
```

## Run Locally

```bash
git clone https://github.com/dereknnguyen/dashboard-project.git
cd dashboard-project
```

Then open `index.html` in a browser, or serve the folder with any static server (for example `python -m http.server`).

## Limitations

- **Not a real-time feed.** Frankfurter publishes rates once per working day, so the values only change daily. The feed demonstrates API ingestion and status monitoring, not live market data.
- **Example drawdown values.** The simulator uses a fixed $2,000 trailing buffer for illustration. Real drawdown amounts vary by account size and plan, so always refer to the firm's published rules.
- **Simulated diagnostics.** The support console outputs are scripted and labeled `[SIMULATED]`. They do not connect to any broker, platform, or firm systems.

## Possible Next Steps

- Add more ticket scenarios (payout questions, rule violations, data feed disconnects).
- Support multiple account sizes with their own drawdown rules.
- Write short help-center style articles for each scenario.
- Swap in a real-time market data source with CORS support.

// ====== PART 1: FX RATE DATA FEED (Frankfurter API, ECB reference rates) ======
// Note: Frankfurter publishes rates once per working day (~16:00 CET),
// so values only change daily. This is demo data, not a live market feed.
const FX_API_URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP';
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes is plenty for daily data

async function fetchMarketData() {
    try {
        const response = await fetch(FX_API_URL);
        if (!response.ok) throw new Error(`API responded with status ${response.status}`);

        const data = await response.json();
        if (!data.rates || !data.rates.EUR || !data.rates.GBP) {
            throw new Error('Unexpected API response format.');
        }

        // Scale the USD-based rates into index-style point values for the demo
        const techWeightIndex = (1 / data.rates.EUR) * 100;
        const globalMacroIndex = (1 / data.rates.GBP) * 130;

        document.getElementById('btc-price').innerText = `Index: ${techWeightIndex.toFixed(2)} pts`;
        document.getElementById('eth-price').innerText = `Index: ${globalMacroIndex.toFixed(2)} pts`;

        document.getElementById('status-dot').style.backgroundColor = '#10b981';
        document.getElementById('status-text').innerText = 'Online / Feed Sync Active';
    } catch (error) {
        document.getElementById('status-dot').style.backgroundColor = '#ef4444';
        document.getElementById('status-text').innerText = 'Feed Link Error / Retrying';
        console.error('Data feed sync error:', error);
    }
}

setInterval(fetchMarketData, POLL_INTERVAL_MS);
fetchMarketData();


// ====== PART 2: PROP FIRM RISK & DRAWDOWN LOGIC ======
function calculateDrawdown() {
    const startingBalance = parseFloat(document.getElementById('account-size').value) || 0;
    const peakBalance = parseFloat(document.getElementById('current-balance').value) || 0;

    // EXAMPLE VALUE ONLY: real trailing drawdown amounts vary by account size and plan.
    // Replace with the figure for a specific account from the firm's published rules.
    const maxDrawdownDistance = 2000;

    let drawdownThreshold = peakBalance - maxDrawdownDistance;

    // Once the trailing threshold reaches the starting balance, it locks there
    if (drawdownThreshold > startingBalance) {
        drawdownThreshold = startingBalance;
    }

    const currentLossAllowance = peakBalance - drawdownThreshold;

    document.getElementById('drawdown-threshold').innerText =
        `$${drawdownThreshold.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    document.getElementById('loss-remaining').innerText =
        `$${currentLossAllowance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    const lossElement = document.getElementById('loss-remaining').parentElement;
    if (currentLossAllowance <= 500) {
        lossElement.style.color = '#ef4444'; // low-buffer warning
    } else {
        lossElement.style.color = '#f8fafc';
    }
}

document.getElementById('account-size').addEventListener('input', calculateDrawdown);
document.getElementById('current-balance').addEventListener('input', calculateDrawdown);
calculateDrawdown();


// ====== PART 3: SIMULATED TICKET SUPPORT CONSOLE ======
// All output below is simulated for demonstration purposes.
function simulateDiagnostic(type) {
    const consoleBox = document.getElementById('console-output');
    consoleBox.innerText = 'Running simulated diagnostic...\n';

    setTimeout(() => {
        if (type === 'latency') {
            consoleBox.innerText += '[SIMULATED] Platform API check - OK\n';
            consoleBox.innerText += '[SIMULATED] Data feed latency: 42ms (stable)\n';
            consoleBox.innerText += 'RECOMMENDATION: Data connections look healthy. Ask the trader to clear the browser cache, restart the platform, and confirm the issue on a second device or network.';
        } else if (type === 'auth') {
            consoleBox.innerText += '[SIMULATED] ERR 401: Unauthorized response from broker API.\n';
            consoleBox.innerText += '[SIMULATED] STATE: Authentication failed, data feed not connected.\n';
            consoleBox.innerText += 'RECOMMENDATION: Credentials or API token are invalid or expired. Have the trader re-enter credentials or generate a new token, then retry the connection.';
        } else {
            consoleBox.innerText += 'No diagnostic script found for this scenario.';
        }
    }, 800);
}

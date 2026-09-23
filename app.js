// ====== PART 1: LIVE FINANCIAL API DATA STREAM ======
async function fetchMarketData() {
    try {
        // Utilizing a 100% open, CORS-enabled public endpoint for browser environments
        const response = await fetch('https://coingecko.com');
        if (!response.ok) throw new Error('API routing bridge degradation.');
        
        const data = await response.json();
        
        // Target dynamic UI DOM elements safely using optional chaining rules
        const btcPrice = data?.bitcoin?.usd || 0;
        const ethPrice = data?.ethereum?.usd || 0;
        
        // Dynamically update UI text outputs
        document.getElementById('btc-price').innerText = `$${btcPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('eth-price').innerText = `$${ethPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        
        // Update Connection Status Flags to alert active sync state
        document.getElementById('status-dot').style.backgroundColor = '#10b981'; // Operational Green
        document.getElementById('status-text').innerText = 'Online / Feed Sync Active';
    } catch (error) {
        document.getElementById('status-dot').style.backgroundColor = '#ef4444'; // Alarm Red
        document.getElementById('status-text').innerText = 'Feed Link Error / Retrying';
        console.error("Telemetry data sync deviation:", error);
    }
}

// Poll market API every 15 seconds to simulate persistent data feed streams
setInterval(fetchMarketData, 15000);
fetchMarketData();


// ====== PART 2: PRO-FIRM RISK & DRAWDOWN LOGIC ======
function calculateDrawdown() {
    const startingBalance = parseFloat(document.getElementById('account-size').value) || 0;
    const peakBalance = parseFloat(document.getElementById('current-balance').value) || 0;
    
    // Simulating standard Tradeify account evaluation boundaries (\$2,000 trailing buffer)
    const maxDrawdownDistance = 2000; 
    
    let drawdownThreshold = peakBalance - maxDrawdownDistance;
    
    // Guardrail rule: Once trailing threshold reaches starting balance, it locks natively
    if (drawdownThreshold > startingBalance) {
        drawdownThreshold = startingBalance;
    }
    
    const currentLossAllowance = peakBalance - drawdownThreshold;

    // Output parsing updates
    document.getElementById('drawdown-threshold').innerText = `$${drawdownThreshold.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('loss-remaining').innerText = `$${currentLossAllowance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    const lossElement = document.getElementById('loss-remaining').parentElement;
    if (currentLossAllowance <= 500) {
        lossElement.style.color = '#ef4444'; // Risk alarm state triggered
    } else {
        lossElement.style.color = '#f8fafc';
    }
}

document.getElementById('account-size').addEventListener('input', calculateDrawdown);
document.getElementById('current-balance').addEventListener('input', calculateDrawdown);
calculateDrawdown();


// ====== PART 3: SIMULATED TICKET SUPPORT CONSOLE ======
function simulateDiagnostic(type) {
    const consoleBox = document.getElementById('console-output');
    consoleBox.innerText = "Executing telemetry network diagnostic trace query...\n";
    
    setTimeout(() => {
        if (type === 'latency') {
            consoleBox.innerText += "PING api.tradeify.co/v1 - Success\n";
            consoleBox.innerText += "PING rithmic.live.data.feed - Latency: 42ms (Stable)\n";
            consoleBox.innerText += "RESOLUTION RECOMMENDATION: Data broker links active. Advise trader to flush local browser cache and partition cookies to sync UI storage loops.";
        } else if (type === 'auth') {
            consoleBox.innerText += "ERR: 401 Unauthorized Response from Client Web Broker Node.\n";
            consoleBox.innerText += "STATE: Local data feed synchronization failure.\n";
            consoleBox.innerText += "RESOLUTION RECOMMENDATION: Access secret key string invalid. Instruct client to cleanly generate a fresh API token configuration inside Tradeify user portal.";
        }
    }, 800);
}

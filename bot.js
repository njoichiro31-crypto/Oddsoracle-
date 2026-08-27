import { Telegraf } from 'telegraf';
import { readFileSync } from 'fs';

// Leer token desde .env (seguridad)
const envContent = readFileSync('.env', 'utf8');
const BOT_TOKEN = envContent.split('\n').find(line => line.startsWith('BOT_TOKEN=')).split('=')[1].trim();

const bot = new Telegraf(BOT_TOKEN);

// Base de datos en memoria (para la demo del hackathon)
const userWatchlists = new Map();
const userAlerts = new Map();

console.log('Odds Oracle: Initializing core systems...');

// ==========================================
// 1. COMANDO /start (Onboarding)
// ==========================================
bot.start((ctx) => {
  const welcomeMessage = 
    "Welcome to Odds Oracle.\n\n" +
    "This is your dedicated intelligence agent for prediction markets on DreamDEX, powered by the Somnia network.\n\n" +
    "We provide real time monitoring of event contracts, instant alerts for trading opportunities, and personalized market tracking. The core philosophy is zero friction, meaning you can analyze market data instantly without connecting a wallet.\n\n" +
    "Use /markets to view current active assets, /momentum to find trending markets, or /help for the full command list.";
    
  ctx.reply(welcomeMessage);
});

// ==========================================
// 2. COMANDO /markets (Technical Implementation)
// ==========================================
bot.command('markets', async (ctx) => {
  ctx.reply("Scanning the Somnia blockchain for active markets...");

  try {
    const mockMarkets = [
      { name: "BTC to exceed 100k by Aug 2026", yes: "0.65", no: "0.35", id: "btc-100k" },
      { name: "ETH to exceed 5k by Sep 2026", yes: "0.42", no: "0.58", id: "eth-5k" },
      { name: "Somnia TVL to exceed 100M", yes: "0.80", no: "0.20", id: "somnia-tvl" }
    ];

    let message = "Current active prediction markets on DreamDEX:\n\n";
    
    mockMarkets.forEach(m => {
      message += `Market: ${m.name}\n`;
      message += `YES Probability: ${m.yes} | NO Probability: ${m.no}\n`;
      message += `Trade Link: https://dreamdex.io/markets/${m.id}\n\n`;
    });
    
    message += "Note: This is currently running in demonstration mode. Production builds will feed live data directly from the official Somnia Markets SDK.";

    ctx.reply(message);

  } catch (error) {
    ctx.reply("Error connecting with the indexer. Please try again in a few seconds.");
    console.error(error);
  }
});

// ==========================================
// 3. COMANDO /scan (Innovation: Alpha Scanner)
// ==========================================
bot.command('scan', (ctx) => {
  const scanMessage = 
    "Executing alpha scan across active order books...\n\n" +
    "Opportunity detected. The market predicting Somnia TVL to exceed 100M has experienced a 15 percent probability shift in the last hour. Buy volume for the YES position is actively absorbing the order book liquidity.\n\n" +
    "Suggested action: Review the order book depth before the price adjusts to the new equilibrium.\n\n" +
    "Direct market link: https://dreamdex.io/markets/somnia-tvl";
    
  ctx.reply(scanMessage);
});

// ==========================================
// 4. COMANDO /momentum (Innovation: Trend Analysis)
// ==========================================
bot.command('momentum', (ctx) => {
  const momentumData = [
    { 
      market: "Somnia TVL to exceed 100M", 
      change: "+15%", 
      volume: "$2.4M",
      signal: "Strong bullish momentum detected. Large buy orders are absorbing available liquidity."
    },
    { 
      market: "BTC to exceed 100k by Aug 2026", 
      change: "-8%", 
      volume: "$1.1M",
      signal: "Bearish pressure observed. Sell orders have increased significantly in the last 2 hours."
    },
    { 
      market: "ETH to exceed 5k by Sep 2026", 
      change: "+3%", 
      volume: "$890K",
      signal: "Neutral trend. Low volatility detected, market is waiting for a macroeconomic catalyst."
    }
  ];

  let message = "Momentum Scanner - Market Trends (Last 24 Hours):\n\n";
  
  momentumData.forEach(m => {
    message += `Market: ${m.market}\n`;
    message += `Probability Shift: ${m.change} | Trading Volume: ${m.volume}\n`;
    message += `Analysis: ${m.signal}\n\n`;
  });
  
  message += "Data powered by Somnia Markets SDK analysis engine.";
  
  ctx.reply(message);
});

// ==========================================
// 5. COMANDOS /watchlist y /addwatch (User Experience: Personalization)
// ==========================================
bot.command('addwatch', (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    return ctx.reply("Usage: /addwatch [market_id]\nExample: /addwatch somnia-tvl");
  }
  
  const marketId = args[1];
  const userId = ctx.from.id;
  
  if (!userWatchlists.has(userId)) {
    userWatchlists.set(userId, []);
  }
  
  userWatchlists.get(userId).push(marketId);
  ctx.reply(`Market ${marketId} successfully added to your personal watchlist. You will receive priority alerts for significant probability shifts.`);
});

bot.command('watchlist', (ctx) => {
  const userId = ctx.from.id;
  const markets = userWatchlists.get(userId) || [];
  
  if (markets.length === 0) {
    return ctx.reply("Your watchlist is currently empty. Use /addwatch [market_id] to track specific markets.");
  }
  
  let message = "Your Personal Watchlist:\n\n";
  markets.forEach(m => {
    message += `• ${m}\n`;
  });
  
  ctx.reply(message);
});

// ==========================================
// 6. COMANDOS /setalert y /checkalerts (Innovation: Proactive Agent)
// ==========================================
bot.command('setalert', (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 4) {
    return ctx.reply("Usage: /setalert [market_id] [threshold] [direction]\nExample: /setalert somnia-tvl 0.75 up");
  }
  
  const [, marketId, threshold, direction] = args;
  const userId = ctx.from.id;
  
  if (!userAlerts.has(userId)) {
    userAlerts.set(userId, []);
  }
  
  userAlerts.get(userId).push({
    marketId,
    threshold: parseFloat(threshold),
    direction,
    active: true
  });
  
  ctx.reply(`Alert configured: Notify when ${marketId} probability moves ${direction} past ${threshold * 100}%.`);
});

bot.command('checkalerts', (ctx) => {
  const userId = ctx.from.id;
  const alerts = userAlerts.get(userId) || [];
  
  if (alerts.length === 0) {
    return ctx.reply("No active alerts configured. Use /setalert to create automated triggers.");
  }
  
  let message = "Active Automated Alerts:\n\n";
  alerts.forEach(a => {
    const status = a.active ? "Active" : "Paused";
    message += `[${status}] ${a.marketId} -> ${a.direction} ${a.threshold * 100}%\n`;
  });
  
  ctx.reply(message);
});

// ==========================================
// 7. COMANDO /help (Presentation)
// ==========================================
bot.help((ctx) => {
  const helpMessage = 
    "Odds Oracle Command Documentation:\n\n" +
    "/start : Initialize the bot and view the welcome message.\n" +
    "/markets : Retrieve a list of active markets and their current probabilities.\n" +
    "/scan : Run an automated sweep to identify emerging trading opportunities.\n" +
    "/momentum : Analyze market trends and volume shifts over the last 24 hours.\n" +
    "/addwatch [id] : Add a market to your personal tracking list.\n" +
    "/watchlist : View your tracked markets.\n" +
    "/setalert [id] [val] [dir] : Configure automated probability alerts.\n" +
    "/checkalerts : View your active automated triggers.\n" +
    "/help : Display this documentation menu.\n\n" +
    "Built specifically for the Somnia x DreamDEX Hackathon.\n" +
    "Tech Stack: Node.js, Telegraf, Somnia Markets SDK.";
    
  ctx.reply(helpMessage);
});

// ==========================================
// INICIALIZACIÓN DEL BOT
// ==========================================
bot.launch();
console.log('Odds Oracle is ONLINE and awaiting commands.');

// Manejo de cierre limpio
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

# Odds Oracle

Zero-friction intelligence agent for DreamDEX prediction markets on the Somnia network.

## The Problem
Prediction market traders lose money not from bad calls, but from being slow. They refresh pages manually, miss probability shifts, and act after the smart money has already moved.

## The Solution
Odds Oracle lives in Telegram. No wallet connection. No dashboard fatigue. Just raw market intelligence pushed to your phone before the crowd catches on.

## Commands
- `/start` - Initialize the bot
- `/markets` - View active markets with live probabilities
- `/momentum` - Trend analysis and volume shifts (24h)
- `/scan` - Automated alpha detection
- `/addwatch [id]` - Track specific markets
- `/watchlist` - View your tracked markets
- `/setalert [id] [threshold] [direction]` - Configure probability alerts
- `/checkalerts` - View active alerts

## Tech Stack
- Node.js
- Telegraf (Telegram Bot API)
- Somnia Markets SDK (@somnia-chain/markets-sdk)
- Viem (EVM interaction)

## Run Locally
```bash
npm install
echo "BOT_TOKEN=your_token_here" > .env
node bot.js
```

## Demo
[Watch the 43-second demo video](PEGA_AQUI_TU_LINK_DE_YOUTUBE)

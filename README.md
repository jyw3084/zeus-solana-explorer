# Zeus Solana Explorer

A modern web application for exploring the Solana blockchain with real-time data and analytics.

## Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://zeus-solana-explorer.pages.dev/)

## Architecture

### Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Shadcn UI
- **State Management**: React Context + Providers
- **Blockchain Integration**: @solana/web3.js
- **Data Fetching**: Server Components + API Routes

### Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
├── data/        # Data models and constants
├── lib/         # Core utilities and configurations
├── providers/   # Context providers
├── server/      # Server-side logic
└── utils/       # Helper functions
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jyw3084/zeus-solana-explorer.git
cd zeus-solana-explorer
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Configuration

1. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

2. Configure the following environment variables:

```env
# Required: Solana Mainnet RPC endpoint
NEXT_PUBLIC_MAINNET_RPC_URL= <!-- Your Mainnet URL -->

# Required: Solana Devnet RPC endpoint
NEXT_PUBLIC_DEVNET_RPC_URL= <!-- Your Devnet URL -->
```
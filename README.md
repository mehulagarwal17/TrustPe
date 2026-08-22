<div align="center">

# 🤝 TrustPe

### Money that keeps its word.

Programmable, trustless gifts that release themselves — no middleman, no reminders, no waiting.

<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Viem](https://img.shields.io/badge/Viem-000000?style=for-the-badge&logo=ethereum&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Monad](https://img.shields.io/badge/Monad_Testnet-836EF9?style=for-the-badge&logo=ethereum&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

</div>

---

## 💡 The problem

"I'll give you the money when X happens" is a promise, not a guarantee. Right now that means:

- **Trusting a person** to remember and follow through — they might not.
- **Paying a lawyer** to draft a formal trust — slow, expensive, overkill for most cases.

Either way, there's a gap between *the condition being met* and *the money actually moving* — and something human has to bridge it.

## ✨ What TrustPe does

TrustPe replaces that gap with a smart contract. You lock funds against a plain-language condition. When the milestone is confirmed, the funds release **instantly and automatically** — nobody has to remember, nobody has to be trusted to follow through.

```
  Lock funds  →  Milestone confirmed  →  Instant, automatic release
```

Built on **Monad**, so the release isn't just automatic — it's fast enough that the whole "confirm → funds land" moment happens in front of you, live.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔒 **Locked, conditional gifts** | Funds are held in a smart contract until the stated condition is met — recoverable by no one until then. |
| 🤖 **AI-assisted milestone verification** | Powered by Google Gemini (`@google/genai`) to help evaluate whether submitted proof satisfies a gift's condition, reducing reliance on manual judgment calls. |
| ⚡ **Live confirmation timer** | Every transaction shows real measured wall-clock time to confirmation — making Monad's speed something you *see*, not just a claim. |
| 📱 **QR-based sharing** | Gifts and wallet actions can be shared via QR code (`qrcode.react`) for fast, in-person demo flows. |
| 🎉 **Release animations** | A real confetti + motion celebration (`canvas-confetti`, `motion`) fires the moment a gift unlocks — not just a status text change. |
| 🌐 **Non-custodial by design** | TrustPe never holds funds outside the contract itself — it's the contract, not TrustPe, that controls release. |

---

## 🏗️ Tech stack

**Frontend**
- [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) for animation
- [lucide-react](https://lucide.dev/) for icons

**Backend**
- [Express](https://expressjs.com/) server (`server.ts`), bundled with `esbuild` for production
- [Google Gemini API](https://ai.google.dev/) (`@google/genai`) for AI-assisted milestone evaluation

**Blockchain**
- [Solidity](https://soliditylang.org/) smart contracts (`/contracts`)
- [Viem](https://viem.sh/) for all on-chain reads/writes
- Deployed on [Monad Testnet](https://docs.monad.xyz/)

**Tooling**
- [Bun](https://bun.sh/) for package management
- `tsx` for local dev, `vite build` + `esbuild` for production builds

---

## 📂 Project structure

```
TrustPe/
├── contracts/       # Solidity smart contracts — gift creation & milestone release logic
├── src/             # React frontend
├── server.ts        # Express server (API routes, Gemini integration)
├── index.html        # Vite entry point
├── .env.example      # Required environment variables (copy to .env)
└── vite.config.ts    # Vite configuration
```

---

## 🛠️ Getting started

### Prerequisites
- [Bun](https://bun.sh/) installed
- A Monad Testnet wallet with test MON ([faucet](https://faucet.monad.xyz))
- A Google Gemini API key

### Setup

```bash
# Clone the repo
git clone https://github.com/mehulagarwal17/TrustPe.git
cd TrustPe

# Install dependencies
bun install

# Configure environment variables
cp .env.example .env
# then fill in your Gemini API key, RPC URL, and contract address

# Run locally
bun run dev
```

### Build for production

```bash
bun run build
bun run start
```

---

## 🔗 Network configuration

TrustPe runs on **Monad Testnet**:

| | |
|---|---|
| Chain ID | `10143` |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Currency | `MON` |
| Explorer | `https://testnet.monadvision.com` |
| Faucet | `https://faucet.monad.xyz` |

---

## 🗺️ Roadmap

- [ ] Custom, non-default trigger authority per gift (delegate confirmation to a third party)
- [ ] Multi-recipient / split-condition gifts
- [ ] Notification layer for recipients when a gift is created for them
- [ ] Mainnet deployment

---

## 📄 License

This project was built for **Monad Blitz Hyderabad**. License TBD.

---

<div align="center">

Built by [The CodeQuesters](https://github.com/mehulagarwal17)

</div>

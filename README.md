<div align="center">

<img src="public/icons/icon.svg" alt="Montrack Logo" width="96" height="96" />

# Montrack

**Track your money, own your future.**

[![CI/CD](https://github.com/WasathTheekshana/montrack/actions/workflows/ci.yaml/badge.svg)](https://github.com/WasathTheekshana/montrack/actions/workflows/ci.yaml)
&nbsp;
<a href="https://montrack.app"><img src="https://img.shields.io/badge/Live%20Demo-montrack.app-FFE135?style=flat-square&labelColor=0A0A0A" alt="Live Demo" /></a>
&nbsp;
<img src="https://img.shields.io/badge/License-MIT-ADFF2F?style=flat-square&labelColor=0A0A0A" alt="MIT License" />
&nbsp;
<img src="https://img.shields.io/badge/PWA-Ready-FF2D78?style=flat-square&labelColor=0A0A0A" alt="PWA Ready" />

</div>

---

Montrack is an open-source personal finance tracker built as a Progressive Web App. No account, no server, no cloud - your data lives entirely in your browser. Create monthly budgets, log transactions in any currency, and stay on top of your finances with a clean brutalist UI.

---

## Features

- **Month-based budgeting** - create a budget month with categories across bills, expenses, savings, and debt
- **Multi-currency support** - log transactions in any currency with live exchange rates; all totals converted to your base currency automatically, with a tap-to-toggle to see the original amount
- **Income tracking** - record expected and actual income sources, see what is left to spend
- **Daily spending view** - running balance day by day for the full month period
- **Charts** - spending breakdown by budget category and daily trend chart
- **Backup and restore** - export all your data to a JSON file and import it back anytime to recover from data loss
- **Daily reminders** - optional browser push notifications with a custom reminder time to nudge you to log transactions
- **Delete all data** - wipe everything from localStorage with a confirmation flow
- **PWA** - installable on desktop and mobile, works fully offline
- **No account required** - 100% local, nothing leaves your device

---

## Tech Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Webpack) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| PWA | [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Phosphor Icons](https://phosphoricons.com) |
| Dates | [date-fns](https://date-fns.org) |
| Storage | Browser `localStorage` |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn

### Run locally

```bash
git clone https://github.com/WasathTheekshana/montrack.git
cd montrack
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
yarn build
yarn start
```

No environment variables are needed. The app runs entirely client-side.

---

## Demo Data

A demo backup file is included so you can explore the app with realistic data right away.

1. Open the app and go to **Settings → Backup & Restore → Import**
2. Select `montrack-demo-backup.json` from the project root
3. Three months of LKR and USD transactions across all budget categories will be loaded instantly

---

## Self Hosting

**One-click Vercel deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WasathTheekshana/montrack)

**Manual**

```bash
yarn build
yarn start   # runs on port 3000
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Dashboard - month cards and recent transactions
│   ├── months/[id]/      # Month detail - overview, budget, transactions, daily, charts
│   ├── settings/         # Currency, reminders, backup and restore, danger zone
│   └── about/            # About page
├── components/
│   ├── layout/           # PageLayout and sidebar
│   ├── modals/           # Create month, add transaction, budget item, income modals
│   ├── month/            # KPI cards, budget sections, charts, daily view
│   └── ui/               # Shared primitives - NumberInput, Select, LoadingScreen
├── lib/
│   ├── hooks/            # useMonths, useBudget, useTransactions, useIncome,
│   │                     # useSettings, useCurrency, useNotifications
│   ├── repositories/     # localStorage read/write per entity
│   ├── storage/          # Storage adapter and key constants
│   ├── backup.ts         # Export, import, and clear all data
│   └── calculations.ts   # Budget summaries, month stats, daily spendings
└── types/                # Shared TypeScript types
```

---

## CI / CD

One pipeline runs on GitHub Actions:

| Workflow | Trigger | Steps |
|----------|---------|-------|
| **CI/CD** | Push and PR to `main` | Lint → Type check → Build → Deploy to Vercel |

---

## Contributing

Contributions are welcome. Open an issue before submitting a large PR.

```bash
git checkout -b feat/your-feature
# make changes
git commit -m "feat: describe your change"
git push origin feat/your-feature
# open a pull request
```

---

## License

MIT - see [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built by <a href="https://github.com/WasathTheekshana">Wasath Theekshana</a></sub>
  <br /><br />
  <a href="https://buymeacoffee.com/wasath">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
  </a>
  &nbsp;
  <a href="https://ko-fi.com/wasath">
    <img src="https://img.shields.io/badge/Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-fi" />
  </a>
</div>

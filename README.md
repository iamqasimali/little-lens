# LittleLens

> **Scan any product. Understand everything about it.**

LittleLens is an open, ad-free mobile app that turns a barcode scan into a full product transparency report — covering health, child safety, Halal status, and corporate ownership, all at once.

---

## Why LittleLens?

Existing apps specialize. Yuka does health scores. HalalFoodScan checks E-codes. Buy'r traces brand ownership. No single app combines all three — and none puts child safety at the center.

LittleLens fills that gap with four independent **Pillars**, scored transparently for every product you scan.

---

## The Four Pillars

| Pillar | What it checks | Always free? |
|---|---|---|
| **Health** | Nutri-Score, saturated fat, salt, additive count | Yes |
| **Good for Kids?** | Caffeine, artificial dyes (Red #40, Yellow #5), allergens, sugar vs. pediatric thresholds | Yes — always |
| **Halal Status** | E-code lookup + certification body cross-reference | Yes |
| **Who Makes This?** | Brand → subsidiary → parent conglomerate ownership tree | Basic: free · Full tree: Premium |

> Child safety flags are **never** paywalled. A parent should never need a subscription to know if a product contains caffeine or a hyperactivity-linked dye.

---

## Screenshots

> _Coming soon — app is in active development._

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Offline cache | expo-sqlite (7-day TTL per product) |
| Barcode scanning | expo-camera · react-native-vision-camera |
| Core data | Open Food Facts API v2 |

---

## Project Structure

```
app/
├── _layout.tsx              # Root Stack navigator
├── (tabs)/
│   ├── _layout.tsx          # Tab bar (Scan / History / Settings)
│   ├── index.tsx            # Camera scanner screen
│   ├── history.tsx          # Recent scans list
│   └── settings.tsx         # Scoring profile + premium
└── product/
    └── [barcode].tsx        # Full product passport screen

src/
├── scoring/
│   ├── index.ts             # Orchestrates all four pillars
│   ├── healthScore.ts       # Nutri-Score + nutriment penalties
│   ├── kidsScore.ts         # Stimulants, dyes, allergens, sugar
│   ├── halalScore.ts        # Halal stub (IFANCA integration pending)
│   └── ownershipScore.ts    # Ownership stub (graph DB pending)
├── services/
│   └── openFoodFacts.ts     # Open Food Facts API v2 client
├── store/
│   └── productStore.ts      # Zustand: scan history, preferences
├── db/
│   └── cache.ts             # SQLite offline product cache
├── types/
│   └── index.ts             # ProductPassport, PillarScore, Flag, etc.
└── utils/
    └── gradeColor.ts        # Grade → colour mapping
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) on your mobile device **or** a development build (see below)

### Install

```bash
git clone git@github.com:iamqasimali/little-lens.git
cd little-lens
npm install
```

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) or press `w` to open in your browser.

> **Note:** Expo SDK 55 requires the latest Expo Go. If you see a version mismatch error, uninstall and reinstall Expo Go from the Play Store / App Store.

### Development Build (recommended for physical device testing)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile development
```

EAS builds in the cloud and delivers an `.apk` install link — no Android SDK required locally.

---

## Available Commands

```bash
npx expo start          # Start dev server
npx expo start --web    # Open directly in browser
npx tsc --noEmit        # Type check
npx jest                # Run tests
npx expo-doctor         # Check project health
```

---

## Scoring Design Principles

LittleLens scores are designed to avoid the pitfalls of existing apps:

- **Transparent** — every score includes a human-readable reason. No black-box outputs.
- **Nuanced** — we don't penalize calories without context. We distinguish natural from added sugar.
- **Modular** — each pillar scores independently. A missing Halal database never degrades your Health score.
- **Scientifically sourced** — thresholds are cited (EFSA, AHA, NHS). The scoring logic is open for review in `src/scoring/`.
- **User-configurable** — choose a Scoring Profile (Default / Parent Mode / Halal Strict) to surface what matters most to you.

---

## Data Sources

| Data | Source |
|---|---|
| Product database | [Open Food Facts](https://world.openfoodfacts.org/) — open-source, 3M+ products |
| Health thresholds | EFSA · NHS · Nutri-Score methodology |
| Kids safety thresholds | AHA pediatric sugar guidelines · EFSA additive reviews |
| Halal status | IFANCA _(integration in progress)_ |
| Corporate ownership | Ownership graph database _(integration in progress)_ |

---

## Monetization

LittleLens follows a **freemium, ad-free** model:

- **Free** — unlimited scanning, all four pillar scores, all child safety flags
- **Premium** (~$10–$50/year) — detailed ingredient explanations, full ownership trees, personalised alerts ("notify me if a product contains X"), offline mode

**LittleLens never accepts money from brands to influence scores.**

---

## Roadmap

- [x] Barcode scanner with Open Food Facts lookup
- [x] SQLite offline cache (7-day TTL)
- [x] Health pillar scorer (Nutri-Score + nutriment penalties)
- [x] Kids pillar scorer (stimulants, dyes, allergens, sugar)
- [x] Product passport detail screen
- [x] Scan history + Settings screens
- [ ] Halal pillar — IFANCA data integration
- [ ] Ownership pillar — brand graph database
- [ ] Premium subscription (RevenueCat)
- [ ] Personalised alerts
- [ ] User-contributed product data
- [ ] iOS App Store + Google Play release

---

## Contributing

Contributions are welcome — especially for data integrations (Halal, ownership) and scientific review of the scoring methodology.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a pull request

Please keep scoring changes backed by a cited scientific source.

---

## License

[MIT](./LICENSE) — free to use, modify, and distribute.

---

## Disclaimer

LittleLens is an informational tool only. It is not a substitute for professional medical, dietary, or religious advice. Product data is sourced from Open Food Facts community contributions and may be incomplete or outdated.

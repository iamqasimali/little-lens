# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LittleLens** (product name: Transparency Advisor) is a mobile app that lets users scan a product barcode and instantly receive a unified report covering:

1. **Health & Ingredient Safety** — scored against scientific databases (EFSA, EWG)
2. **Good for Kids?** — the primary differentiator; flags stimulants (caffeine, guarana), artificial dyes linked to hyperactivity (Red #40, Yellow #5), allergens, sugar exceeding pediatric thresholds, and choking hazards
3. **Halal Status** — cross-referenced against a certification body database (target: IFANCA)
4. **Corporate Ownership** — traces brand → parent company → conglomerate lineage

The app competes with Yuka, Open Food Facts, HalalFoodScan, Buy'r, and Grano, but is the only app combining all four pillars in one scan.

## Core Architectural Decisions

### Data Layer (Hybrid Model)
- **Foundation:** Open Food Facts API (open-source, 3M+ products, community-maintained)
- **Halal layer:** Custom lookup table or licensed feed from a Halal certification body — stored separately from the core product DB and versioned independently
- **Corporate ownership layer:** Brand → subsidiary → parent company graph database (modeled after Buy'r); updates need to propagate without breaking cached product reports
- **Ingredient safety layer:** EFSA and EWG cross-reference; flagging logic must be independently auditable and update-safe (a scientific advisory board owns this logic)

### Scoring Engine
The scoring algorithm is the intellectual core of the app. Key design constraints:
- **Modular:** Each pillar (health, kids, halal, ownership) scores independently and can be updated without affecting others
- **Transparent:** Every score must expose *why* it was given — no black-box outputs
- **Nuanced:** Distinguish natural vs. added sugars; never penalize calories without context (avoid Yuka's criticized approach)
- **Customizable:** Users can set personal priorities (e.g., "prioritize No Artificial Dyes"). The scoring weights must be user-overridable at runtime, not hardcoded

### Monetization Constraints (Non-Negotiable)
- **No ads, no paid placements, no brand influence over scores** — independence is the core trust signal
- **Free tier:** Unlimited scanning, basic product passport, simple overall scores
- **Premium tier (~$10–$50/year):** Detailed ingredient explanations, personalized alerts ("notify me if product contains X"), offline mode, full corporate ownership trees
- Premium gate must never degrade the free scan result's accuracy — only depth/personalization is paywalled

## Tech Stack

- **Framework:** React Native with Expo SDK 55 (managed workflow)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based, app/ directory)
- **State:** Zustand (`src/store/`)
- **Barcode scanning:** `expo-camera` (primary, `CameraView` + `onBarcodeScanned`); `react-native-vision-camera` available for high-performance use
- **Offline cache:** `expo-sqlite` — SQLite via `src/db/cache.ts`, 7-day TTL per product
- **Core data API:** Open Food Facts API v2 (`src/services/openFoodFacts.ts`)

## Commands

```bash
# Start dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run tests
npx jest

# Run a single test file
npx jest src/scoring/kidsScore.test.ts

# Type check
npx tsc --noEmit

# Check project health
npx expo-doctor
```

## Key Domain Concepts

| Term | Definition |
|---|---|
| **Product Passport** | The full report returned after a scan: origin, ingredients, scores across all four pillars |
| **Pillar** | One of the four scoring domains: Health, Kids, Halal, Ownership |
| **GranoScore-style profile** | User-defined scoring weight preset (e.g., "Parent mode", "Halal-strict mode") |
| **E-code** | European food additive codes (e.g., E102 = Yellow #5); used by Halal and health layers |
| **Ownership tree** | Graph of brand → subsidiary → parent conglomerate relationships |

## Critical Product Constraints

- **Scientific advisory board owns ingredient flagging logic** — never hardcode "safe/unsafe" ingredient decisions in application code; these must live in a versioned, externally-maintained data file or service
- **Child safety flags are non-negotiable** — caffeine, guarana, Red #40, Yellow #5, allergens, and choking hazard product forms must always surface in the free tier; they cannot be paywalled
- **Halal status must cite its source** — never display a Halal rating without surfacing which certification body or database determined it
- **Ownership data must show confidence level** — corporate structures change; the UI must indicate data freshness and source

## Reference Competitors

- Yuka — health scores, 73M users, no ads, word-of-mouth growth
- Open Food Facts — open data foundation we build on top of
- HalalFoodScan — E-code Halal lookup, dedicated Halal scanner
- Buy'r — corporate ownership graph, #1 App Store Health & Fitness at launch
- Grano — customizable scoring profiles including child-specific (iOS only)

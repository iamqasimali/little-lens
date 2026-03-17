import { Flag, PillarScore } from '../types';

// Ingredients that must always be surfaced for kids — never paywalled
const STIMULANT_FLAGS: Record<string, string> = {
  caffeine: 'CAFFEINE',
  guarana: 'GUARANA',
  'green tea extract': 'CAFFEINE_EXTRACT',
};

const DYE_FLAGS: Record<string, string> = {
  'red 40': 'RED_40',
  'allura red': 'RED_40',
  'yellow 5': 'YELLOW_5',
  'tartrazine': 'YELLOW_5',
  'yellow 6': 'YELLOW_6',
  'blue 1': 'BLUE_1',
};

const ALLERGEN_CODES = ['en:gluten', 'en:peanuts', 'en:tree-nuts', 'en:milk', 'en:eggs', 'en:soy', 'en:shellfish'];

export function scoreForKids(
  ingredientsText: string = '',
  allergens: string = '',
  nutriments: Record<string, number> = {}
): PillarScore {
  const flags: Flag[] = [];
  const lower = ingredientsText.toLowerCase();

  // Check stimulants
  for (const [ingredient, code] of Object.entries(STIMULANT_FLAGS)) {
    if (lower.includes(ingredient)) {
      flags.push({
        code,
        label: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
        severity: 'critical',
        pillar: 'kids',
        reason: 'Stimulant not recommended for children.',
      });
    }
  }

  // Check hyperactivity-linked dyes
  for (const [ingredient, code] of Object.entries(DYE_FLAGS)) {
    if (lower.includes(ingredient)) {
      flags.push({
        code,
        label: ingredient.toUpperCase(),
        severity: 'warning',
        pillar: 'kids',
        reason: 'Artificial dye linked to hyperactivity in children (EFSA review).',
      });
    }
  }

  // Check sugar vs pediatric threshold (~25g/day for children per AHA)
  const sugarsPer100g = nutriments['sugars_100g'] ?? 0;
  if (sugarsPer100g > 12.5) {
    flags.push({
      code: 'HIGH_SUGAR',
      label: 'High Sugar',
      severity: 'warning',
      pillar: 'kids',
      reason: `${sugarsPer100g}g sugar per 100g — exceeds pediatric recommended threshold.`,
    });
  }

  // Check allergens
  for (const allergen of ALLERGEN_CODES) {
    if (allergens.includes(allergen)) {
      const name = allergen.replace('en:', '');
      flags.push({
        code: `ALLERGEN_${name.toUpperCase().replace('-', '_')}`,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        severity: 'warning',
        pillar: 'kids',
        reason: `Contains ${name} — common childhood allergen.`,
      });
    }
  }

  const criticalCount = flags.filter(f => f.severity === 'critical').length;
  const warningCount = flags.filter(f => f.severity === 'warning').length;

  let score = 100;
  score -= criticalCount * 30;
  score -= warningCount * 10;
  score = Math.max(0, score);

  const grade =
    score >= 85 ? 'A' :
    score >= 70 ? 'B' :
    score >= 55 ? 'C' :
    score >= 40 ? 'D' : 'F';

  return {
    score,
    grade,
    flags,
    source: 'Open Food Facts + EFSA/AHA guidelines',
  };
}

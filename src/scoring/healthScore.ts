import { Flag, PillarScore } from '../types';

// Open Food Facts Nutri-Score → base score
const NUTRI_SCORE_BASE: Record<string, number> = {
  a: 95,
  b: 75,
  c: 55,
  d: 35,
  e: 15,
};

/**
 * Score a product's general health using Open Food Facts nutriments.
 * Base comes from Nutri-Score if available; otherwise we compute from raw nutriments.
 * We intentionally avoid penalising calories without context (a Yuka criticism).
 */
export function scoreForHealth(
  nutrimentGrade: string = '',          // e.g. "a", "b", "c" from nutrition_grades
  nutriments: Record<string, number> = {},
  additivesTags: string[] = [],
): PillarScore {
  const flags: Flag[] = [];
  const gradeLower = nutrimentGrade.toLowerCase();
  let score = NUTRI_SCORE_BASE[gradeLower] ?? null;

  // If no Nutri-Score, estimate from raw nutriments
  if (score === null) {
    score = 70; // neutral starting point

    const saturatedFat = nutriments['saturated-fat_100g'] ?? 0;
    const salt = nutriments['salt_100g'] ?? 0;
    const fiber = nutriments['fiber_100g'] ?? 0;
    const proteins = nutriments['proteins_100g'] ?? 0;

    if (saturatedFat > 5) score -= 10;
    if (salt > 1.5) score -= 10;
    if (fiber > 3) score += 5;      // bonus — fiber is beneficial
    if (proteins > 5) score += 5;   // bonus — protein density
  }

  // Penalise excessive additives (European E-code count)
  const additiveCount = additivesTags.length;
  if (additiveCount > 5) {
    score -= 10;
    flags.push({
      code: 'HIGH_ADDITIVES',
      label: `${additiveCount} Additives`,
      severity: 'warning',
      pillar: 'health',
      reason: `Contains ${additiveCount} food additives. High additive counts are associated with ultra-processed food (NOVA group 4).`,
    });
  }

  // Flag high salt
  const salt100g = nutriments['salt_100g'] ?? 0;
  if (salt100g > 1.5) {
    flags.push({
      code: 'HIGH_SALT',
      label: 'High Salt',
      severity: 'warning',
      pillar: 'health',
      reason: `${salt100g.toFixed(1)}g salt per 100g — above 1.5g is considered high (NHS guideline).`,
    });
  }

  // Flag high saturated fat
  const satFat = nutriments['saturated-fat_100g'] ?? 0;
  if (satFat > 5) {
    flags.push({
      code: 'HIGH_SAT_FAT',
      label: 'High Saturated Fat',
      severity: 'warning',
      pillar: 'health',
      reason: `${satFat.toFixed(1)}g saturated fat per 100g — above 5g is considered high.`,
    });
  }

  score = Math.min(100, Math.max(0, score));

  // Derive grade from final score (map to A-F, not Nutri-Score A-E)
  const grade =
    score >= 85 ? 'A' :
    score >= 70 ? 'B' :
    score >= 55 ? 'C' :
    score >= 40 ? 'D' : 'F';

  return {
    score,
    grade,
    flags,
    source: 'Open Food Facts Nutri-Score + EFSA nutriment thresholds',
  };
}

import { PillarScores } from '../types';
import { scoreForHealth } from './healthScore';
import { scoreForKids } from './kidsScore';
import { scoreForHalal } from './halalScore';
import { scoreForOwnership } from './ownershipScore';

/**
 * Run all four pillar scorers against a raw Open Food Facts product object.
 * Each pillar is independent — a failure in one never affects others.
 */
export function scoreProduct(raw: Record<string, unknown>): PillarScores {
  const nutriments = (raw.nutriments as Record<string, number>) ?? {};
  const additivesTags = (raw.additives_tags as string[]) ?? [];

  return {
    health: scoreForHealth(
      raw.nutrition_grades as string,
      nutriments,
      additivesTags,
    ),
    kids: scoreForKids(
      raw.ingredients_text as string,
      raw.allergens as string,
      nutriments,
    ),
    halal: scoreForHalal(
      raw.ingredients_text as string,
      additivesTags,
    ),
    ownership: scoreForOwnership(
      raw.brands as string,
    ),
  };
}

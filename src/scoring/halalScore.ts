import { PillarScore } from '../types';

/**
 * Halal scoring stub.
 *
 * Production implementation will cross-reference:
 *   1. A licensed feed from a recognised certification body (target: IFANCA)
 *   2. A local E-code lookup table for additives of animal/alcohol origin
 *
 * Every result MUST cite its certification source — never display a Halal
 * rating without surfacing which body determined it.
 */
export function scoreForHalal(
  _ingredientsText: string = '',
  _additivesTags: string[] = [],
): PillarScore {
  return {
    score: null,
    grade: 'UNKNOWN',
    flags: [
      {
        code: 'HALAL_DATA_PENDING',
        label: 'Data Pending',
        severity: 'info',
        pillar: 'halal',
        reason: 'Halal certification database not yet integrated. Coming soon.',
      },
    ],
    source: 'IFANCA (pending integration)',
  };
}

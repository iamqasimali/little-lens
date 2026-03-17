import { PillarScore } from '../types';

/**
 * Corporate ownership scoring stub.
 *
 * Production implementation will:
 *   1. Look up brand → subsidiary → parent conglomerate via a graph database
 *   2. Surface ownership depth, country of HQ, and publicly known ethical flags
 *   3. Show data freshness date — corporate structures change frequently
 *
 * The UI must always display a confidence / freshness indicator alongside
 * any ownership result.
 */
export function scoreForOwnership(
  _brand: string = '',
): PillarScore {
  return {
    score: null,
    grade: 'UNKNOWN',
    flags: [
      {
        code: 'OWNERSHIP_DATA_PENDING',
        label: 'Data Pending',
        severity: 'info',
        pillar: 'ownership',
        reason: 'Corporate ownership database not yet integrated. Coming soon.',
      },
    ],
    source: 'Ownership graph (pending integration)',
    dataFreshnessDate: undefined,
  };
}

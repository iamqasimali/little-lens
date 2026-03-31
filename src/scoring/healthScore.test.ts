import { scoreForHealth } from './healthScore';

describe('scoreForHealth', () => {
  it('uses Nutri-Score grade when present', () => {
    const result = scoreForHealth('a', {}, []);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.grade).toBe('A');
  });

  it('flags high salt and high saturated fat from nutriments', () => {
    const result = scoreForHealth('', { 'salt_100g': 2.0, 'saturated-fat_100g': 6.0 }, []);
    expect(result.flags.some((f) => f.code === 'HIGH_SALT')).toBe(true);
    expect(result.flags.some((f) => f.code === 'HIGH_SAT_FAT')).toBe(true);
  });

  it('flags high additive count', () => {
    const result = scoreForHealth('', {}, ['en:e100', 'en:e101', 'en:e102', 'en:e103', 'en:e104', 'en:e105']);
    expect(result.flags.some((f) => f.code === 'HIGH_ADDITIVES')).toBe(true);
  });
});


import { scoreForKids } from './kidsScore';

describe('scoreForKids', () => {
  it('flags stimulants as critical', () => {
    const result = scoreForKids('Contains caffeine, sugar', '', { sugars_100g: 5 });
    expect(result.flags.some((f) => f.code === 'CAFFEINE' && f.severity === 'critical')).toBe(true);
  });

  it('flags hyperactivity-linked dyes', () => {
    const result = scoreForKids('Ingredients: water, red 40', '', { sugars_100g: 0 });
    expect(result.flags.some((f) => f.code === 'RED_40')).toBe(true);
  });

  it('flags high sugar over threshold', () => {
    const result = scoreForKids('Ingredients: water', '', { sugars_100g: 20 });
    expect(result.flags.some((f) => f.code === 'HIGH_SUGAR')).toBe(true);
  });

  it('flags allergens from OFF allergen tags string', () => {
    const result = scoreForKids('Ingredients: peanuts', 'en:peanuts,en:milk', { sugars_100g: 0 });
    expect(result.flags.some((f) => f.code === 'ALLERGEN_PEANUTS')).toBe(true);
    expect(result.flags.some((f) => f.code === 'ALLERGEN_MILK')).toBe(true);
  });
});


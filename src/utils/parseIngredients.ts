export function parseIngredients(ingredientsText?: string): string[] {
  if (!ingredientsText) return [];

  return ingredientsText
    .split(/[,;]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}


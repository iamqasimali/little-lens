export interface ProductPassport {
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  ingredients: string[];
  scores: PillarScores;
  scannedAt: string;
}

export interface PillarScores {
  health: PillarScore;
  kids: PillarScore;
  halal: PillarScore;
  ownership: PillarScore;
}

export interface PillarScore {
  score: number | null; // 0-100, null = insufficient data
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | 'UNKNOWN';
  flags: Flag[];
  source: string;
  dataFreshnessDate?: string;
}

export interface Flag {
  code: string;       // e.g. "CAFFEINE", "RED_40", "ALLERGEN_PEANUT"
  label: string;
  severity: 'critical' | 'warning' | 'info';
  pillar: 'health' | 'kids' | 'halal' | 'ownership';
  reason: string;     // human-readable explanation — never black-box
}

export type ScoringProfile = 'default' | 'parent' | 'halal-strict' | 'custom';

export interface UserPreferences {
  profile: ScoringProfile;
  priorityFlags: string[];   // flag codes user wants surfaced first
  premiumUnlocked: boolean;
}

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProductStore } from '../../src/store/productStore';
import { ScoringProfile } from '../../src/types';

const PROFILES: { key: ScoringProfile; label: string; description: string }[] = [
  {
    key: 'default',
    label: 'Default',
    description: 'Balanced scoring across all four pillars.',
  },
  {
    key: 'parent',
    label: 'Parent Mode',
    description: 'Prioritises kids safety — stimulants, dyes, and allergens surfaced first.',
  },
  {
    key: 'halal-strict',
    label: 'Halal Strict',
    description: 'Halal status is the primary filter. Products with unverified status are flagged.',
  },
];

function ProfileOption({
  profile,
  selected,
  onSelect,
}: {
  profile: (typeof PROFILES)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.option, selected && styles.optionSelected]} onPress={onSelect}>
      <View style={styles.optionHeader}>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
          {profile.label}
        </Text>
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.optionDescription}>{profile.description}</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { preferences, setProfile } = useProductStore();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Scoring Profile</Text>
      <Text style={styles.sectionSubtitle}>
        Choose how LittleLens prioritises results when you scan a product.
      </Text>
      {PROFILES.map((p) => (
        <ProfileOption
          key={p.key}
          profile={p}
          selected={preferences.profile === p.key}
          onSelect={() => setProfile(p.key)}
        />
      ))}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Premium</Text>
      <View style={styles.premiumBanner}>
        <Text style={styles.premiumTitle}>Unlock Full Transparency</Text>
        <Text style={styles.premiumSubtitle}>
          Detailed ingredient explanations, corporate ownership trees, personalised alerts, and
          offline mode.
        </Text>
        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Coming Soon</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        LittleLens is ad-free and never accepts payment from brands to influence scores.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  sectionSubtitle: { fontSize: 14, color: '#3C3C43', marginBottom: 16, lineHeight: 20 },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: { borderColor: '#007AFF' },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  optionLabel: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  optionLabelSelected: { color: '#007AFF' },
  checkmark: { fontSize: 16, color: '#007AFF', fontWeight: '700' },
  optionDescription: { fontSize: 13, color: '#8E8E93', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 24 },
  premiumBanner: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  premiumTitle: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  premiumSubtitle: { fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 16 },
  premiumButton: { backgroundColor: '#E5E5EA', borderRadius: 8, padding: 12, alignItems: 'center' },
  premiumButtonText: { fontSize: 15, fontWeight: '600', color: '#8E8E93' },
  footer: { fontSize: 12, color: '#8E8E93', textAlign: 'center', marginTop: 32, lineHeight: 18 },
});

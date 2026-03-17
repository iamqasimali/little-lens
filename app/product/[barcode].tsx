import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProductStore } from '../../src/store/productStore';
import { Flag, PillarScore } from '../../src/types';
import { gradeColor, severityColor } from '../../src/utils/gradeColor';

// ─── Pillar Card ─────────────────────────────────────────────────────────────

const PILLAR_LABELS: Record<string, { emoji: string; title: string }> = {
  health:    { emoji: '🥗', title: 'Health' },
  kids:      { emoji: '👶', title: 'Good for Kids?' },
  halal:     { emoji: '☪️',  title: 'Halal Status' },
  ownership: { emoji: '🏢', title: 'Who Makes This?' },
};

function FlagRow({ flag }: { flag: Flag }) {
  return (
    <View style={[styles.flagRow, { borderLeftColor: severityColor(flag.severity) }]}>
      <Text style={[styles.flagLabel, { color: severityColor(flag.severity) }]}>
        {flag.label}
      </Text>
      <Text style={styles.flagReason}>{flag.reason}</Text>
    </View>
  );
}

function PillarCard({ pillarKey, score }: { pillarKey: string; score: PillarScore }) {
  const { emoji, title } = PILLAR_LABELS[pillarKey] ?? { emoji: '•', title: pillarKey };
  const color = gradeColor(score.grade);
  const hasData = score.score !== null;

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <Text style={styles.pillarEmoji}>{emoji}</Text>
        <Text style={styles.pillarTitle}>{title}</Text>
        <View style={[styles.gradePill, { backgroundColor: color }]}>
          <Text style={styles.gradePillText}>
            {hasData ? `${score.grade}  ${score.score}` : score.grade}
          </Text>
        </View>
      </View>

      {/* Flags */}
      {score.flags.length > 0 && (
        <View style={styles.flagList}>
          {score.flags.map((flag) => (
            <FlagRow key={flag.code} flag={flag} />
          ))}
        </View>
      )}

      {hasData && score.flags.length === 0 && (
        <Text style={styles.noFlags}>No concerns found for this pillar.</Text>
      )}

      {/* Source citation — always shown */}
      <Text style={styles.sourceText}>Source: {score.source}</Text>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ProductScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { recentScans, currentProduct } = useProductStore();

  // Prefer currentProduct if it matches, otherwise look up from history
  const product =
    currentProduct?.barcode === barcode
      ? currentProduct
      : recentScans.find((p) => p.barcode === barcode);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Product not found.</Text>
        <Text style={styles.notFoundSub}>Scan the barcode again to load its report.</Text>
      </View>
    );
  }

  const pillarOrder: Array<keyof typeof product.scores> = ['kids', 'health', 'halal', 'ownership'];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Product header */}
      <View style={styles.productHeader}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📦</Text>
          </View>
        )}
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.barcodeText}>Barcode: {product.barcode}</Text>
      </View>

      {/* Pillar cards */}
      <Text style={styles.sectionLabel}>PRODUCT REPORT</Text>
      {pillarOrder.map((key) => (
        <PillarCard key={key} pillarKey={key} score={product.scores[key]} />
      ))}

      {/* Ingredients */}
      {product.ingredients.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>INGREDIENTS</Text>
          <View style={styles.card}>
            <Text style={styles.ingredientsText}>{product.ingredients.join(', ')}</Text>
          </View>
        </>
      )}

      <Text style={styles.disclaimer}>
        LittleLens is an informational tool only. It is not a substitute for professional
        medical, dietary, or religious advice. Data sourced from Open Food Facts community
        contributions.
      </Text>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { paddingBottom: 48 },

  // Product header
  productHeader: { backgroundColor: '#fff', alignItems: 'center', padding: 24, marginBottom: 8 },
  productImage: { width: 120, height: 120, marginBottom: 12 },
  imagePlaceholder: {
    width: 120, height: 120, backgroundColor: '#F2F2F7', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  imagePlaceholderText: { fontSize: 48 },
  productName: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', textAlign: 'center' },
  productBrand: { fontSize: 15, color: '#8E8E93', marginTop: 4 },
  barcodeText: { fontSize: 12, color: '#C7C7CC', marginTop: 6 },

  // Section labels
  sectionLabel: {
    fontSize: 12, fontWeight: '600', color: '#8E8E93',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginHorizontal: 16, marginTop: 20, marginBottom: 8,
  },

  // Pillar cards
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16,
    marginBottom: 10, padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  pillarEmoji: { fontSize: 22, marginRight: 8 },
  pillarTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  gradePill: {
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  gradePillText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Flags
  flagList: { gap: 8 },
  flagRow: {
    borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 4,
  },
  flagLabel: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  flagReason: { fontSize: 12, color: '#3C3C43', lineHeight: 17 },
  noFlags: { fontSize: 13, color: '#34C759', fontWeight: '500' },

  // Source
  sourceText: { fontSize: 11, color: '#C7C7CC', marginTop: 12 },

  // Ingredients
  ingredientsText: { fontSize: 13, color: '#3C3C43', lineHeight: 20 },

  // Not found state
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  notFoundText: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  notFoundSub: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },

  // Disclaimer
  disclaimer: {
    fontSize: 11, color: '#8E8E93', textAlign: 'center',
    marginHorizontal: 24, marginTop: 24, lineHeight: 17,
  },
});

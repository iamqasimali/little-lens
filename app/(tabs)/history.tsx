import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProductStore } from '../../src/store/productStore';
import { ProductPassport } from '../../src/types';
import { gradeColor } from '../../src/utils/gradeColor';

function HistoryRow({ item }: { item: ProductPassport }) {
  const router = useRouter();
  const overallGrade = item.scores.kids.grade; // kids is the primary differentiator

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/product/${item.barcode}`)}
    >
      <View style={[styles.gradeBadge, { backgroundColor: gradeColor(overallGrade) }]}>
        <Text style={styles.gradeText}>{overallGrade}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { recentScans } = useProductStore();

  if (recentScans.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📦</Text>
        <Text style={styles.emptyText}>No scans yet</Text>
        <Text style={styles.emptySubtext}>Scan a barcode to see its product report here.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recentScans}
      keyExtractor={(item) => item.barcode + item.scannedAt}
      renderItem={({ item }) => <HistoryRow item={item} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  gradeBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gradeText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  rowInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  brand: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  chevron: { fontSize: 20, color: '#C7C7CC', marginLeft: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
});

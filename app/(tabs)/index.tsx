import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCachedProduct, cacheProduct } from '../../src/db/cache';
import { scoreProduct } from '../../src/scoring';
import { fetchProductByBarcode } from '../../src/services/openFoodFacts';
import { useProductStore } from '../../src/store/productStore';
import { ProductPassport } from '../../src/types';
import { parseIngredients } from '../../src/utils/parseIngredients';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setCurrentProduct, addToHistory } = useProductStore();
  const router = useRouter();
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function handleBarcodeScan({ data: barcode }: { data: string }) {
    if (!scanning || loading) return;
    setScanning(false);
    setLoading(true);
    setErrorMsg(null);

    try {
      let raw = await getCachedProduct(barcode);
      if (!raw) {
        raw = await fetchProductByBarcode(barcode);
        if (raw) await cacheProduct(barcode, raw);
      }

      if (!raw) {
        setErrorMsg('Product not found. Try scanning again or check the barcode.');
        return;
      }

      const passport: ProductPassport = {
        barcode,
        name: raw.product_name ?? 'Unknown Product',
        brand: raw.brands ?? 'Unknown Brand',
        imageUrl: raw.image_url,
        ingredients: parseIngredients(raw.ingredients_text),
        scores: scoreProduct(raw),
        scannedAt: new Date().toISOString(),
      };

      setCurrentProduct(passport);
      addToHistory(passport);
      router.push(`/product/${barcode}`);
    } catch (e) {
      console.error('Barcode scan lookup failed', e);
      const message =
        e instanceof Error && /Open Food Facts API error/i.test(e.message)
          ? 'Service error. Try again in a moment.'
          : e instanceof TypeError
            ? 'Network error. Check your connection and try again.'
            : 'Something went wrong. Try scanning again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
      // Re-enable scanning after 3 seconds (gives time to navigate away)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setScanning(true);
        setErrorMsg(null);
      }, 3000);
    }
  }

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera access is required to scan products.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarcodeScan}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
      />

      {/* Viewfinder overlay */}
      <View style={styles.viewfinder} pointerEvents="none">
        <View style={styles.viewfinderBox} />
      </View>

      {/* Status area */}
      <View style={styles.statusArea}>
        {loading ? (
          <View style={styles.statusBubble}>
            <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
            <Text style={styles.statusText}>Looking up product…</Text>
          </View>
        ) : errorMsg ? (
          <View style={[styles.statusBubble, styles.errorBubble]}>
            <Text style={styles.statusText}>{errorMsg}</Text>
          </View>
        ) : (
          <View style={styles.statusBubble}>
            <Text style={styles.statusText}>Point at a product barcode</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  message: { color: '#fff', textAlign: 'center', marginBottom: 24, paddingHorizontal: 32, fontSize: 16, lineHeight: 24 },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  // Viewfinder
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderBox: {
    width: 240,
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },

  // Status
  statusArea: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  errorBubble: {
    backgroundColor: 'rgba(255,59,48,0.8)',
  },
  statusText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});

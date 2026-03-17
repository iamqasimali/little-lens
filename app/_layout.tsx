import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[barcode]"
        options={{
          title: 'Product Details',
          headerBackTitle: 'Scan',
          headerTintColor: '#007AFF',
        }}
      />
    </Stack>
  );
}

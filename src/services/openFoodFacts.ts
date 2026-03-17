const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export async function fetchProductByBarcode(barcode: string) {
  const response = await fetch(`${BASE_URL}/product/${barcode}?fields=product_name,brands,ingredients_text,nutriments,allergens,image_url`);
  if (!response.ok) {
    throw new Error(`Open Food Facts API error: ${response.status}`);
  }
  const data = await response.json();
  if (data.status === 0) {
    return null; // product not found
  }
  return data.product;
}

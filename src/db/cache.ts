import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('littlelens.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS product_cache (
        barcode TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        cached_at TEXT NOT NULL
      );
    `);
  }
  return db;
}

export async function getCachedProduct(barcode: string) {
  const db = await getDb();
  const row = await db.getFirstAsync<{ data: string; cached_at: string }>(
    'SELECT data, cached_at FROM product_cache WHERE barcode = ?',
    [barcode]
  );
  if (!row) return null;

  // Invalidate cache older than 7 days
  const cachedAt = new Date(row.cached_at);
  const ageMs = Date.now() - cachedAt.getTime();
  if (ageMs > 7 * 24 * 60 * 60 * 1000) {
    await db.runAsync('DELETE FROM product_cache WHERE barcode = ?', [barcode]);
    return null;
  }

  try {
    return JSON.parse(row.data);
  } catch {
    await db.runAsync('DELETE FROM product_cache WHERE barcode = ?', [barcode]);
    return null;
  }
}

export async function cacheProduct(barcode: string, data: object) {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO product_cache (barcode, data, cached_at) VALUES (?, ?, ?)',
    [barcode, JSON.stringify(data), new Date().toISOString()]
  );
}

import { openDB, type IDBPDatabase } from 'idb';
import type { Subscription } from '@/entities/subscription';

const DB_NAME = 'gym-tracker';
const DB_VERSION = 2;
const STORE_SUBS = 'subscriptions';
const STORE_META = 'meta';

interface MetaRecord {
  key: string;
  value: unknown;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore(STORE_SUBS, { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const db = await getDb();
  return db.getAll(STORE_SUBS);
}

export async function saveSubscription(subscription: Subscription): Promise<void> {
  const db = await getDb();
  await db.put(STORE_SUBS, subscription);
}

export async function deleteSubscription(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_SUBS, id);
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  return getSubscriptions();
}

const STORAGE_KEY = 'gym_subscriptions';

function isValidSubscriptionArray(data: unknown): data is Subscription[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Subscription).id === 'string' &&
      typeof (item as Subscription).name === 'string' &&
      typeof (item as Subscription).totalSessions === 'number' &&
      typeof (item as Subscription).startDate === 'string' &&
      Array.isArray((item as Subscription).visits)
  );
}

export function resetDb(): void {
  dbPromise = null;
}

export async function clearAllSubscriptions(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE_SUBS);
}

export async function replaceAllSubscriptions(subscriptions: Subscription[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_SUBS, 'readwrite');
  await tx.store.clear();
  for (const sub of subscriptions) {
    await tx.store.put(sub);
  }
  await tx.done;
}

export async function migrateFromLocalStorage(): Promise<boolean> {
  const db = await getDb();

  const migrated = await db.get(STORE_META, 'migrated');
  if (migrated?.value === true) return false;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await db.put(STORE_META, { key: 'migrated', value: true });
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    let data: Subscription[] | null = null;

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      '_schemaVersion' in parsed &&
      'data' in parsed
    ) {
      const extracted = (parsed as { data: unknown }).data;
      if (isValidSubscriptionArray(extracted)) {
        data = extracted;
      }
    } else if (isValidSubscriptionArray(parsed)) {
      data = parsed;
    }

    if (!data) {
      localStorage.removeItem(STORAGE_KEY);
      await db.put(STORE_META, { key: 'migrated', value: true });
      return false;
    }

    const tx = db.transaction(STORE_SUBS, 'readwrite');
    for (const sub of data) {
      await tx.store.put(sub);
    }
    await tx.done;

    await db.put(STORE_META, { key: 'migrated', value: true });
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    await db.put(STORE_META, { key: 'migrated', value: true });
    return false;
  }
}

import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

const originalToLocaleDateString = Date.prototype.toLocaleDateString;

Date.prototype.toLocaleDateString = function (locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions) {
  return originalToLocaleDateString.call(this, 'en-US', options);
};

afterEach(async () => {
  const { openDB } = await import('idb');
  try {
    const db = await openDB('gym-tracker', 2);
    await db.clear('subscriptions');
    await db.clear('meta');
    db.close();
  } catch {
    // DB may not exist yet — that's fine
  }

  const { resetDb } = await import('@/shared/lib/storage');
  await resetDb();
});

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, set, off } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyAl6U6hwZsqNLoxYmdWrQMkH6F-0dnn7Kg",
  authDomain: "fia-clean-and-care.firebaseapp.com",
  databaseURL: "https://fia-clean-and-care-default-rtdb.firebaseio.com",
  projectId: "fia-clean-and-care",
  storageBucket: "fia-clean-and-care.firebasestorage.app",
  messagingSenderId: "64795058382",
  appId: "1:64795058382:web:adb5c87e5c53c07a67309f"
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);

export interface CloudPayload {
  products: any[];
  cosProducts: any[];
  customers: any[];
  suppliers: any[];
  sales: any[];
  purchases: any[];
  expenses: any[];
  stockReturns: any[];
  clearedDayBookIds: string[];
  appPin: string;
  _meta?: {
    updatedAt: number;
    clientId?: string;
  };
}

export const myClientId = 'client_' + Math.random().toString(36).substring(2, 9);

export function subscribeToCloud(
  onData: (data: CloudPayload) => void,
  onError: (error: Error) => void
) {
  const dataRef = ref(db, 'fia_data');
  const unsubscribe = onValue(
    dataRef,
    (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const normalizeArray = (arr: any) => {
          if (!arr) return [];
          return Array.isArray(arr) ? arr : Object.values(arr);
        };

        const parsed: CloudPayload = {
          products: normalizeArray(val.products),
          cosProducts: normalizeArray(val.cosProducts),
          customers: normalizeArray(val.customers),
          suppliers: normalizeArray(val.suppliers),
          sales: normalizeArray(val.sales),
          purchases: normalizeArray(val.purchases),
          expenses: normalizeArray(val.expenses),
          stockReturns: normalizeArray(val.stockReturns),
          clearedDayBookIds: normalizeArray(val.clearedDayBookIds || val.clearedDayBookEntries),
          appPin: val.appPin || '1234',
          _meta: val._meta
        };
        onData(parsed);
      }
    },
    (error) => {
      console.error('Firebase realtime sync error:', error);
      onError(error);
    }
  );

  return () => off(dataRef);
}

export async function syncToCloud(payload: CloudPayload): Promise<boolean> {
  try {
    const dataRef = ref(db, 'fia_data');
    const enrichedPayload: CloudPayload = {
      ...payload,
      _meta: {
        updatedAt: Date.now(),
        clientId: myClientId,
      }
    };
    await set(dataRef, enrichedPayload);
    return true;
  } catch (error) {
    console.error('Failed to sync to Firebase cloud:', error);
    return false;
  }
}

export async function saveDailySnapshot(payload: CloudPayload): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const snapRef = ref(db, `fia_daily_backups/${today}`);
    await set(snapRef, {
      ...payload,
      _meta: {
        updatedAt: Date.now(),
        snapshotDate: today,
        clientId: myClientId,
      }
    });
    console.log('[Firebase] Daily snapshot archived for ' + today);
    return true;
  } catch (err) {
    console.warn('Failed to save daily snapshot to Firebase:', err);
    return false;
  }
}

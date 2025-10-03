'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Dexie, { Table } from 'dexie';

// A safe JSON-ish type if your data is plain objects.
// If your data is a richer shape, just pass that as the generic T to the hook.
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [k: string]: JSONValue };

// What we store in IndexedDB
type StoredPortfolio<T> = {
  id: string;           // e.g. "current"
  data: T;
  timestamp: number;
  version: string;
};

// Dexie DB with a string primary key
class PortfolioDB<T> extends Dexie {
  public portfolios!: Table<StoredPortfolio<T>, string>;

  constructor() {
    super('PortfolioDatabase');
    this.version(1).stores({
      // string PK "id" (NOT auto-increment)
      portfolios: 'id,timestamp,version',
    });
  }
}

// Create a DB instance. We’ll narrow the generic at usage time.
const db = new PortfolioDB<unknown>();

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveOptions<T> {
  /** milliseconds; default 30000 */
  interval?: number;
  onSave?: (data: T) => void;
  onError?: (error: Error) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

interface AutoSaveReturn {
  saveNow: () => Promise<void>;
  lastSaveTime: Date | null;
  isSaving: boolean;
  isOnline: boolean;
  hasUnsavedChanges: boolean;
  saveStatus: SaveStatus;
}

export function useAutoSave<T extends JSONValue | Record<string, unknown>>(
  data: T,
  options: AutoSaveOptions<T> = {}
): AutoSaveReturn {
  const {
    interval = 30_000,
    onSave,
    onError,
    onOffline,
    onOnline,
  } = options;

  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDataRef = useRef<string>('');
  const pendingSavesRef = useRef<Array<{ data: T; timestamp: number }>>([]);

  // Save to IndexedDB
  const saveToLocal = useCallback(async (portfolioData: T): Promise<boolean> => {
    try {
      const table = (db as PortfolioDB<T>).table<StoredPortfolio<T>>('portfolios');
      await table.put({
        id: 'current',
        data: portfolioData,
        timestamp: Date.now(),
        version: '1.0.0',
      });
      return true;
    } catch (err) {
      console.error('Local save failed:', err);
      return false;
    }
  }, []);

  // Save to cloud (replace with your API)
  const saveToCloud = useCallback(async (portfolioData: T): Promise<unknown> => {
    try {
      const response = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: portfolioData, timestamp: Date.now() }),
      });
      if (!response.ok) throw new Error('Cloud save failed');
      return response.json();
    } catch (err) {
      console.error('Cloud save failed:', err);
      throw err;
    }
  }, []);

  // Main save function
  const saveNow = useCallback(async (): Promise<void> => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // Always save locally
      await saveToLocal(data);

      // Attempt cloud
      if (isOnline) {
        try {
          await saveToCloud(data);
          pendingSavesRef.current = []; // clear queue on success
        } catch {
          pendingSavesRef.current.push({ data, timestamp: Date.now() });
        }
      } else {
        pendingSavesRef.current.push({ data, timestamp: Date.now() });
      }

      setLastSaveTime(new Date());
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      onSave?.(data);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      onError?.(err as Error);
    } finally {
      setIsSaving(false);
    }
  }, [data, isOnline, isSaving, saveToLocal, saveToCloud, onSave, onError]);

  // Sync queued saves when back online
  const syncPendingSaves = useCallback(async () => {
    if (pendingSavesRef.current.length === 0 || !isOnline) return;
    try {
      for (const pending of pendingSavesRef.current) {
        await saveToCloud(pending.data);
      }
      pendingSavesRef.current = [];
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }, [isOnline, saveToCloud]);

  // Detect changes
  useEffect(() => {
    const current = JSON.stringify(data);
    if (lastDataRef.current && lastDataRef.current !== current) {
      setHasUnsavedChanges(true);
      setSaveStatus('idle');
    }
    lastDataRef.current = current;
  }, [data]);

  // Auto-save timer
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    intervalRef.current = setTimeout(() => { void saveNow(); }, interval);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [hasUnsavedChanges, interval, saveNow]);

  // Online/offline listeners
  useEffect(() => {
    const handleOnline = (): void => {
      setIsOnline(true);
      onOnline?.();
      void syncPendingSaves();
    };
    const handleOffline = (): void => {
      setIsOnline(false);
      onOffline?.();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [onOnline, onOffline, syncPendingSaves]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes';
        void saveNow();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    return;
  }, [hasUnsavedChanges, saveNow]);

  // Load initial timestamp
  useEffect(() => {
    const loadInitial = async (): Promise<void> => {
      try {
        const table = (db as PortfolioDB<T>).table<StoredPortfolio<T>>('portfolios');
        const local = await table.get('current');
        if (local) setLastSaveTime(new Date(local.timestamp));
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };
    void loadInitial();
  }, []);

  return { saveNow, lastSaveTime, isSaving, isOnline, hasUnsavedChanges, saveStatus };
}

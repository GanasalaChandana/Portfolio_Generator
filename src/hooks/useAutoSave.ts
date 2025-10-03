// src/hooks/useAutoSave.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import Dexie from 'dexie'

interface PortfolioData {
  id?: string
  data: any
  timestamp: number
  version: string
}

class PortfolioDB extends Dexie {
  portfolios!: Dexie.Table<PortfolioData, string>

  constructor() {
    super('PortfolioDatabase')
    this.version(1).stores({
      portfolios: '++id, timestamp, version'
    })
  }
}

const db = new PortfolioDB()

interface AutoSaveOptions {
  interval?: number // milliseconds
  onSave?: (data: any) => void
  onError?: (error: Error) => void
  onOffline?: () => void
  onOnline?: () => void
}

interface AutoSaveReturn {
  saveNow: () => Promise<void>
  lastSaveTime: Date | null
  isSaving: boolean
  isOnline: boolean
  hasUnsavedChanges: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

export const useAutoSave = (
  data: any,
  options: AutoSaveOptions = {}
): AutoSaveReturn => {
  const {
    interval = 30000, // 30 seconds
    onSave,
    onError,
    onOffline,
    onOnline
  } = options

  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<string>('')
  const pendingSavesRef = useRef<any[]>([])

  // Save to IndexedDB
  const saveToLocal = useCallback(async (portfolioData: any) => {
    try {
      await db.portfolios.put({
        id: 'current',
        data: portfolioData,
        timestamp: Date.now(),
        version: '1.0.0'
      })
      return true
    } catch (error) {
      console.error('Local save failed:', error)
      return false
    }
  }, [])

  // Save to cloud (mock implementation - replace with your API)
  const saveToCloud = useCallback(async (portfolioData: any) => {
    try {
      const response = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: portfolioData,
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error('Cloud save failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Cloud save failed:', error)
      throw error
    }
  }, [])

  // Main save function
  const saveNow = useCallback(async () => {
    if (isSaving) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      // Always save locally first
      await saveToLocal(data)

      // Try cloud save if online
      if (isOnline) {
        try {
          await saveToCloud(data)
          // Clear pending saves on successful cloud save
          pendingSavesRef.current = []
        } catch (cloudError) {
          // Add to pending saves if cloud fails
          pendingSavesRef.current.push({
            data: data,
            timestamp: Date.now()
          })
        }
      } else {
        // Add to pending saves when offline
        pendingSavesRef.current.push({
          data: data,
          timestamp: Date.now()
        })
      }

      setLastSaveTime(new Date())
      setHasUnsavedChanges(false)
      setSaveStatus('saved')
      onSave?.(data)

    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('error')
      onError?.(error as Error)
    } finally {
      setIsSaving(false)
    }
  }, [data, isOnline, isSaving, saveToLocal, saveToCloud, onSave, onError])

  // Sync pending saves when back online
  const syncPendingSaves = useCallback(async () => {
    if (pendingSavesRef.current.length === 0 || !isOnline) return

    try {
      for (const pendingSave of pendingSavesRef.current) {
        await saveToCloud(pendingSave.data)
      }
      pendingSavesRef.current = []
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }, [isOnline, saveToCloud])

  // Check if data has changed
  useEffect(() => {
    const currentDataString = JSON.stringify(data)
    if (lastDataRef.current !== currentDataString && lastDataRef.current !== '') {
      setHasUnsavedChanges(true)
      setSaveStatus('idle')
    }
    lastDataRef.current = currentDataString
  }, [data])

  // Auto-save timer
  useEffect(() => {
    if (hasUnsavedChanges) {
      intervalRef.current = setTimeout(() => {
        saveNow()
      }, interval)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [hasUnsavedChanges, interval, saveNow])

  // Online/offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      onOnline?.()
      syncPendingSaves()
    }

    const handleOffline = () => {
      setIsOnline(false)
      onOffline?.()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onOnline, onOffline, syncPendingSaves])

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes'
        // Quick save attempt
        saveNow()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, saveNow])

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const localData = await db.portfolios.get('current')
        if (localData) {
          setLastSaveTime(new Date(localData.timestamp))
        }
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    }

    loadInitialData()
  }, [])

  return {
    saveNow,
    lastSaveTime,
    isSaving,
    isOnline,
    hasUnsavedChanges,
    saveStatus
  }
}
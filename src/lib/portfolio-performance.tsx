// src/lib/portfolio-performance.tsx
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface PerformanceMetrics {
  loadTime: number
  memoryUsage: number
  isSlowConnection: boolean
}

interface PerformanceContextType {
  metrics: PerformanceMetrics
  isOptimizedMode: boolean
  showPerformanceIndicators: boolean
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export const usePerformance = () => {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider')
  }
  return context
}

interface PerformanceProviderProps {
  children: ReactNode
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    isSlowConnection: false
  })
  const [isOptimizedMode, setIsOptimizedMode] = useState(false)
  const [showPerformanceIndicators, setShowPerformanceIndicators] = useState(false)

  useEffect(() => {
    // Monitor performance metrics
    const updateMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart

      let memoryUsage = 0
      if ('memory' in performance) {
        const memory = (performance as any).memory
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
      }

      // Detect slow connection
      let isSlowConnection = false
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        isSlowConnection = connection.effectiveType === 'slow-2g' || 
                          connection.effectiveType === '2g' ||
                          connection.downlink < 1.5
      }

      setMetrics({
        loadTime,
        memoryUsage,
        isSlowConnection
      })

      // Enable optimized mode for slow connections or high memory usage
      setIsOptimizedMode(isSlowConnection || memoryUsage > 50)
      
      // Show indicators if performance is concerning
      setShowPerformanceIndicators(loadTime > 2000 || memoryUsage > 30 || isSlowConnection)
    }

    // Initial check
    if (document.readyState === 'complete') {
      setTimeout(updateMetrics, 100)
    } else {
      window.addEventListener('load', updateMetrics)
    }

    // Periodic monitoring
    const interval = setInterval(updateMetrics, 60000) // Every minute

    return () => {
      window.removeEventListener('load', updateMetrics)
      clearInterval(interval)
    }
  }, [])

  return (
    <PerformanceContext.Provider value={{
      metrics,
      isOptimizedMode,
      showPerformanceIndicators
    }}>
      {children}
    </PerformanceContext.Provider>
  )
}

// Performance Status Component
export const PerformanceStatus: React.FC = () => {
  const { metrics, showPerformanceIndicators } = usePerformance()

  if (!showPerformanceIndicators) return null

  return (
    <div className={`performance-indicator show ${
      metrics.memoryUsage > 50 ? 'error' : metrics.memoryUsage > 30 ? 'warning' : ''
    }`}>
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      {metrics.isSlowConnection && <div>Slow connection detected</div>}
    </div>
  )
}

// Auto-save Status Component
interface AutoSaveStatusProps {
  lastSaveTime: Date | null
  isSaving: boolean
  isOnline: boolean
  saveStatus: string
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  lastSaveTime,
  isSaving,
  isOnline,
  saveStatus
}) => {
  const getStatusText = () => {
    if (isSaving) return 'Saving...'
    if (!isOnline) return 'Offline - saved locally'
    if (lastSaveTime) return `Last saved: ${lastSaveTime.toLocaleTimeString()}`
    return 'Ready to save'
  }

  const getStatusClass = () => {
    if (isSaving) return 'saving'
    if (saveStatus === 'error') return 'error'
    if (saveStatus === 'saved') return 'saved'
    return ''
  }

  return (
    <div className={`save-status ${getStatusClass()}`}>
      {isSaving && <div className="loading-spinner"></div>}
      {getStatusText()}
    </div>
  )
}

// Connection Status Component
export const ConnectionStatus: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  return (
    <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  )
}

// Save Indicator Component
export const SaveIndicator: React.FC<{
  show: boolean
  message: string
  type?: 'info' | 'success' | 'error' | 'warning'
}> = ({ show, message, type = 'info' }) => {
  if (!show) return null

  return (
    <div className={`save-indicator ${type} ${show ? 'show' : ''}`}>
      {message}
    </div>
  )
}
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface WasmContextType {
  instance: any | null
  isLoading: boolean
  error: string | null
}

const WasmContext = createContext<WasmContextType | undefined>(undefined)

export const useWasm = () => {
  const context = useContext(WasmContext)
  if (context === undefined) {
    throw new Error('useWasm must be used within a WasmProvider')
  }
  return context
}

interface WasmProviderProps {
  children: ReactNode
}

export const WasmProvider = ({ children }: WasmProviderProps) => {
  const [instance, setInstance] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // @ts-ignore
        const wasmModule = await import('@/public/wasm/main.js')
        const wasmInstance = await wasmModule.default()
        setInstance(wasmInstance)
        setError(null)
      } catch (error) {
        console.error('Failed to load WASM module:', error)
        setError('Failed to load WASM module')
      } finally {
        setIsLoading(false)
      }
    }

    loadWasm()
  }, [])

  const value = {
    instance,
    isLoading,
    error,
  }

  return <WasmContext.Provider value={value}>{children}</WasmContext.Provider>
}

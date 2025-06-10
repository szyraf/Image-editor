'use client'

import { useEffect, useState } from 'react'
import WasmHello from './components/WasmHello'
import LandingPage from './components/LandingPage'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  const [instance, setInstance] = useState<any | null>(null)

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // @ts-ignore
        const wasmModule = await import('@/public/wasm/hello.js')
        const instance = await wasmModule.default()
        setInstance(instance)
      } catch (error) {
        console.error('Failed to load WASM module:', error)
      }
    }

    loadWasm()
  }, [])

  if (!instance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">No wasm instance :C</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Image Editor</h1>
        <LandingPage instance={instance} />
        <WasmHello instance={instance} />
      </div>
    </main>
  )
}

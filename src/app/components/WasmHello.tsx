'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Module: {
      onRuntimeInitialized: () => void
      hello: () => string
      increment_counter: () => number
    }
  }
}

export default function WasmHello() {
  const [message, setMessage] = useState<string>('')
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.Module = {
        onRuntimeInitialized: () => {
          const result = window.Module.hello()
          setMessage(result)
        },
        hello: () => '',
        increment_counter: () => 0,
      }
    }
  }, [])

  const handleIncrement = () => {
    if (typeof window !== 'undefined' && window.Module) {
      const newCount = window.Module.increment_counter()
      setCount(newCount)
    }
  }

  return (
    <div className="p-4">
      <Script src="/wasm/main.js" strategy="afterInteractive" />
      <div className="text-xl font-bold mb-4">{message || 'Loading WASM...'}</div>
      <div className="space-y-4">
        <div className="text-lg">Counter: {count}</div>
        <button
          onClick={handleIncrement}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Increment Counter
        </button>
      </div>
    </div>
  )
}

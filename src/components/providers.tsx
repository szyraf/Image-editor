'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { WasmProvider } from '@/contexts/WasmContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <WasmProvider>{children}</WasmProvider>
    </ThemeProvider>
  )
}

'use client'

import LandingPage from './components/LandingPage'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  return (
    <main className="min-h-screen p-4 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Image Editor</h1>
        <LandingPage />
      </div>
    </main>
  )
}

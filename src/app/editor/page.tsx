'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useWasm } from '@/contexts/WasmContext'
import WasmHello from '../components/WasmHello'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'

export default function EditorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const { instance, isLoading, error } = useWasm()
  const router = useRouter()

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('selectedImage')
    const savedImageName = localStorage.getItem('selectedImageName')

    if (savedImageUrl) {
      setImageUrl(savedImageUrl)
      setImageName(savedImageName)
    } else {
      router.push('/')
    }
  }, [router])

  const handleBackToLanding = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    localStorage.removeItem('selectedImage')
    localStorage.removeItem('selectedImageName')
    router.push('/')
  }

  if (isLoading || !imageUrl) {
    return <LoadingState message={isLoading ? 'Loading WASM module...' : 'Loading image...'} />
  }

  if (error || !instance) {
    return <ErrorState message={error || 'WASM instance not available'} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBackToLanding}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
              {imageName && <h1 className="text-lg font-medium text-foreground truncate">{imageName}</h1>}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center">
          <Card className="max-w-5xl w-full">
            <CardContent className="p-4">
              <img
                src={imageUrl}
                alt={imageName || 'Selected image'}
                className="max-w-full max-h-[80vh] object-contain mx-auto rounded-md"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <WasmHello />
    </div>
  )
}

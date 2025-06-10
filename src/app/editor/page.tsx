'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWasm } from '@/contexts/WasmContext'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'
import FullscreenImageViewer from '@/components/fullscreen-viewer'

export default function EditorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const { instance, isLoading, error } = useWasm()
  const router = useRouter()

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('selectedImage')
    const savedImageName = localStorage.getItem('selectedImageName')

    if (savedImageUrl) {
      setImageUrl(savedImageUrl)
      setImageName(savedImageName)
      setIsFullscreenOpen(true)
    } else {
      router.push('/')
    }
  }, [router])

  const handleCloseFullscreen = () => {
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
      <FullscreenImageViewer
        imageUrl={imageUrl}
        imageName={imageName}
        isOpen={isFullscreenOpen}
        onClose={handleCloseFullscreen}
      />
    </div>
  )
}

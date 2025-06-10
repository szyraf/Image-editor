'use client'

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'

interface LandingPageProps {
  instance: any
}

export default function LandingPage({ instance }: LandingPageProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageSelect = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      alert('Please select a valid image file (JPG, PNG, WebP)')
      return
    }

    setIsLoading(true)

    try {
      const imageUrl = URL.createObjectURL(file)
      localStorage.setItem('selectedImage', imageUrl)
      localStorage.setItem('selectedImageName', file.name)
      router.push('/editor')
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleImageSelect(files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImageSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            handleImageSelect(file)
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <Card
        className={`relative w-full max-w-2xl cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-dashed border-2 hover:border-primary/50 hover:bg-accent/50'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <CardContent className="p-12">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isLoading ? 'Processing image...' : 'Upload Your Image'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Drag and drop an image here or click to browse. Supports JPG, PNG, WebP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground/70 mt-4 text-center">
        You can also paste an image from your clipboard (Ctrl+V / Cmd+V)
      </p>
    </div>
  )
}

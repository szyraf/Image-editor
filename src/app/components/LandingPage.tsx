'use client'

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'

const SAMPLE_IMAGES = [
  { id: 1, src: '/sample-images/sample1.jpg', name: 'Sample Image 1' },
  { id: 2, src: '/sample-images/sample2.jpg', name: 'Sample Image 2' },
]

export default function LandingPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSample, setSelectedSample] = useState<number | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageSelect = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|avif)$/)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, AVIF)')
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

  const handleSampleImageSelect = async (sampleImage: (typeof SAMPLE_IMAGES)[0]) => {
    setIsLoading(true)
    setSelectedSample(sampleImage.id)

    try {
      const response = await fetch(sampleImage.src)
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      localStorage.setItem('selectedImage', imageUrl)
      localStorage.setItem('selectedImageName', sampleImage.name)
      router.push('/editor')
    } catch (error) {
      console.error('Error loading sample image:', error)
      alert('Error loading sample image. Please try again.')
    } finally {
      setIsLoading(false)
      setSelectedSample(null)
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-8">
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
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
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
                Drag and drop an image here or click to browse.
                <br />
                Supports JPG, PNG, WebP, AVIF
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="hidden sm:block text-xs text-muted-foreground/70 mt-4 text-center">
        You can also paste an image from your clipboard (Ctrl+V / Cmd+V)
      </p>

      <div className="h-8" />

      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Or try with Sample Images</h3>
        <div className="grid grid-cols-2 gap-4">
          {SAMPLE_IMAGES.map((sample) => (
            <Card
              key={sample.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedSample === sample.id ? 'ring-2 ring-primary' : ''
              } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              onClick={() => handleSampleImageSelect(sample)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center relative">
                  {imageLoadErrors.has(sample.id) ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <p className="text-xs">Image not found</p>
                    </div>
                  ) : (
                    <img
                      src={sample.src}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.error(`Failed to load image: ${sample.src}`)
                        setImageLoadErrors((prev) => new Set(prev).add(sample.id))
                      }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{sample.name}</p>
                  {selectedSample === sample.id && (
                    <div className="flex items-center justify-center mt-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

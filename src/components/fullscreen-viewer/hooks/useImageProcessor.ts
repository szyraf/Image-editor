import { useState, useCallback } from 'react'
import { useWasm } from '@/contexts/WasmContext'
import { ImageFilters, ColorAdjustments } from '../types'

interface ImageDownloadOptions {
  filters: ImageFilters
  colorAdjustments: ColorAdjustments
}

export const useImageProcessor = (originalImageUrl: string | null, imageName?: string) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { instance } = useWasm()

  const createProcessedCanvas = useCallback(
    async (options: ImageDownloadOptions): Promise<HTMLCanvasElement | null> => {
      if (!originalImageUrl || !instance) return null

      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = originalImageUrl
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        instance.processImageWithAllFilters(
          canvas,
          options.colorAdjustments.brightness,
          options.colorAdjustments.contrast,
          options.colorAdjustments.saturation,
          options.colorAdjustments.monochrome,
          options.filters.blur,
          options.filters.sharpen,
          options.filters.pixelate,
          options.colorAdjustments.gamma
        )

        return canvas
      } catch (error) {
        console.error('Error creating processed canvas:', error)
        return null
      }
    },
    [originalImageUrl, instance]
  )

  const downloadImage = useCallback(
    async (format: 'png' | 'jpeg' | 'webp', options: ImageDownloadOptions, quality?: number) => {
      if (!instance) return

      setIsProcessing(true)

      try {
        const canvas = await createProcessedCanvas(options)
        if (!canvas) return

        const filename = imageName || 'processed-image'

        if (format === 'png') {
          instance.downloadAsPNG(canvas, filename)
        } else if (format === 'jpeg') {
          instance.downloadAsJPEG(canvas, filename, quality || 90)
        } else if (format === 'webp') {
          instance.downloadAsWebP(canvas, filename, quality || 90)
        }
      } catch (error) {
        console.error('Error downloading image:', error)
      } finally {
        setIsProcessing(false)
      }
    },
    [instance, createProcessedCanvas, imageName]
  )

  const updatePreview = useCallback(
    async (format: 'png' | 'jpeg' | 'webp', quality: number, options: ImageDownloadOptions) => {
      if (!instance) return

      setIsProcessing(true)

      try {
        const canvas = await createProcessedCanvas(options)
        if (!canvas) return

        const previewDataUrl = instance.getPreviewDataUrl(canvas, format, quality)
        setPreviewUrl(previewDataUrl)
      } catch (error) {
        console.error('Error updating preview:', error)
        setPreviewUrl(null)
      } finally {
        setIsProcessing(false)
      }
    },
    [instance, createProcessedCanvas]
  )

  return {
    downloadImage,
    updatePreview,
    previewUrl,
    isProcessing,
  }
}

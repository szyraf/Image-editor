import { useState, useCallback } from 'react'
import { useWasm } from '@/contexts/WasmContext'
import { ImageFilters, ColorAdjustments } from '../types'

interface ImageProcessingOptions {
  filters: ImageFilters
  colorAdjustments: ColorAdjustments
}

export const useImageProcessing = (originalImageUrl: string | null) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { instance } = useWasm()

  const hasDefaultValues = useCallback((options: ImageProcessingOptions) => {
    return (
      options.filters.blur === 0 &&
      options.filters.sharpen === 0 &&
      options.filters.pixelate === 0 &&
      options.colorAdjustments.brightness === 100 &&
      options.colorAdjustments.contrast === 100 &&
      options.colorAdjustments.saturation === 100 &&
      options.colorAdjustments.gamma === 100 &&
      !options.colorAdjustments.monochrome
    )
  }, [])

  const processImage = useCallback(
    async (options: ImageProcessingOptions) => {
      if (!originalImageUrl || !instance) {
        setProcessedImageUrl(originalImageUrl)
        return
      }

      if (hasDefaultValues(options)) {
        setProcessedImageUrl(originalImageUrl)
        return
      }

      setIsProcessing(true)

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

        const processedUrl = instance.processImageWithAllFilters(
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

        setProcessedImageUrl(processedUrl)
      } catch (error) {
        console.error('Error processing image:', error)
        setProcessedImageUrl(originalImageUrl)
      } finally {
        setIsProcessing(false)
      }
    },
    [originalImageUrl, instance, hasDefaultValues]
  )

  return {
    processedImageUrl: processedImageUrl || originalImageUrl,
    processImage,
    isProcessing,
  }
}

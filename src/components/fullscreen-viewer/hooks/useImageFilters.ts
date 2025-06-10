import { useState } from 'react'
import { ImageFilters, ColorAdjustments } from '../types'

export const useImageFilters = () => {
  const [filters, setFilters] = useState<ImageFilters>({
    blur: 0,
    sharpen: 0,
    pixelate: 0,
  })

  const [colorAdjustments, setColorAdjustments] = useState<ColorAdjustments>({
    monochrome: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  })

  const updateFilter = (key: keyof ImageFilters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const updateColorAdjustment = (key: keyof ColorAdjustments, value: number | boolean) => {
    setColorAdjustments((prev) => ({ ...prev, [key]: value }))
  }

  const resetAll = () => {
    setFilters({
      blur: 0,
      sharpen: 0,
      pixelate: 0,
    })
    setColorAdjustments({
      monochrome: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
    })
  }

  return {
    filters,
    colorAdjustments,
    updateFilter,
    updateColorAdjustment,
    resetAll,
  }
}

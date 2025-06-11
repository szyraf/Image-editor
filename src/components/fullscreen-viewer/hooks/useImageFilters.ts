import { useState } from 'react'
import { ImageFilters, ColorAdjustments } from '../types'
import { DEFAULT_IMAGE_FILTERS, DEFAULT_COLOR_ADJUSTMENTS } from '../constants'

export const useImageFilters = () => {
  const [filters, setFilters] = useState<ImageFilters>(DEFAULT_IMAGE_FILTERS)

  const [colorAdjustments, setColorAdjustments] = useState<ColorAdjustments>(DEFAULT_COLOR_ADJUSTMENTS)

  const updateFilter = (key: keyof ImageFilters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const updateColorAdjustment = (key: keyof ColorAdjustments, value: number | boolean) => {
    setColorAdjustments((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilter = (key: keyof ImageFilters) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_IMAGE_FILTERS[key] }))
  }

  const resetColorAdjustment = (key: keyof ColorAdjustments) => {
    setColorAdjustments((prev) => ({ ...prev, [key]: DEFAULT_COLOR_ADJUSTMENTS[key] }))
  }

  const resetAll = () => {
    setFilters(DEFAULT_IMAGE_FILTERS)
    setColorAdjustments(DEFAULT_COLOR_ADJUSTMENTS)
  }

  return {
    filters,
    colorAdjustments,
    updateFilter,
    updateColorAdjustment,
    resetFilter,
    resetColorAdjustment,
    resetAll,
  }
}

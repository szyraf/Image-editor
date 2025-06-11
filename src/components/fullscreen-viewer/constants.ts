import { ImageFilters, ColorAdjustments } from './types'

export const DEFAULT_IMAGE_FILTERS: ImageFilters = {
  blur: 0,
  sharpen: 0,
  pixelate: 0,
}

export const DEFAULT_COLOR_ADJUSTMENTS: ColorAdjustments = {
  monochrome: false,
  brightness: 0,
  contrast: 0,
  saturation: 100,
}

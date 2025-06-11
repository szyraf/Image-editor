'use client'

import { ImageFilters } from '../types'
import { FilterControl } from './FilterControl'

interface FiltersSectionProps {
  filters: ImageFilters
  onFilterChange: (key: keyof ImageFilters, value: number) => void
  onFilterCommit: (key: keyof ImageFilters, value: number) => void
  onFilterReset: (key: keyof ImageFilters) => void
}

export const FiltersSection = ({ filters, onFilterChange, onFilterCommit, onFilterReset }: FiltersSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Filters</h4>

      <div className="space-y-4">
        <FilterControl
          label="Gaussian blur"
          value={filters.blur}
          unit="px"
          min={0}
          max={100}
          step={1}
          onChange={(value) => onFilterChange('blur', value)}
          onCommit={(value) => onFilterCommit('blur', value)}
          onReset={() => onFilterReset('blur')}
        />

        <FilterControl
          label="Sharpen"
          value={filters.sharpen}
          min={0}
          max={5}
          step={0.1}
          onChange={(value) => onFilterChange('sharpen', value)}
          onCommit={(value) => onFilterCommit('sharpen', value)}
          onReset={() => onFilterReset('sharpen')}
        />

        <FilterControl
          label="Pixelate"
          value={filters.pixelate}
          unit="px"
          min={0}
          max={100}
          step={1}
          onChange={(value) => onFilterChange('pixelate', value)}
          onCommit={(value) => onFilterCommit('pixelate', value)}
          onReset={() => onFilterReset('pixelate')}
        />
      </div>
    </div>
  )
}

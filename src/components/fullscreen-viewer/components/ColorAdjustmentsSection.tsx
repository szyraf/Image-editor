'use client'

import { ColorAdjustments } from '../types'
import { FilterControl } from './FilterControl'
import { MonochromeToggle } from './MonochromeToggle'

interface ColorAdjustmentsSectionProps {
  colorAdjustments: ColorAdjustments
  onColorAdjustmentChange: (key: keyof ColorAdjustments, value: number | boolean) => void
  onColorAdjustmentCommit: (key: keyof ColorAdjustments, value: number | boolean) => void
  onColorAdjustmentReset: (key: keyof ColorAdjustments) => void
}

export const ColorAdjustmentsSection = ({
  colorAdjustments,
  onColorAdjustmentChange,
  onColorAdjustmentCommit,
  onColorAdjustmentReset,
}: ColorAdjustmentsSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Color Adjustments</h4>

      <div className="space-y-4">
        <MonochromeToggle
          checked={colorAdjustments.monochrome}
          onChange={(value) => onColorAdjustmentChange('monochrome', value)}
          onCommit={(value) => onColorAdjustmentCommit('monochrome', value)}
        />

        <FilterControl
          label="Brightness"
          value={colorAdjustments.brightness}
          min={-255}
          max={255}
          step={1}
          onChange={(value) => onColorAdjustmentChange('brightness', value)}
          onCommit={(value) => onColorAdjustmentCommit('brightness', value)}
          onReset={() => onColorAdjustmentReset('brightness')}
        />

        <FilterControl
          label="Contrast"
          value={colorAdjustments.contrast}
          min={-255}
          max={255}
          step={1}
          onChange={(value) => onColorAdjustmentChange('contrast', value)}
          onCommit={(value) => onColorAdjustmentCommit('contrast', value)}
          onReset={() => onColorAdjustmentReset('contrast')}
        />

        <FilterControl
          label="Saturation"
          value={colorAdjustments.saturation}
          displayValue={colorAdjustments.saturation / 100}
          min={0}
          max={200}
          step={1}
          onChange={(value) => onColorAdjustmentChange('saturation', value)}
          onCommit={(value) => onColorAdjustmentCommit('saturation', value)}
          onReset={() => onColorAdjustmentReset('saturation')}
        />
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RotateCcw } from 'lucide-react'

interface FilterControlProps {
  label: string
  value: number
  displayValue?: number
  unit?: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  onCommit: (value: number) => void
  onReset: () => void
}

export const FilterControl = ({
  label,
  value,
  displayValue,
  unit = '',
  min,
  max,
  step,
  onChange,
  onCommit,
  onReset,
}: FilterControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {displayValue ?? value}
            {unit}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onReset}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to default</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        onValueCommit={(val) => onCommit(val[0])}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
    </div>
  )
}

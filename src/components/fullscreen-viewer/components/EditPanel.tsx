'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { X, Settings, Loader2, Info } from 'lucide-react'
import { Position, ImageFilters, ColorAdjustments } from '../types'

interface EditPanelProps {
  showEditPanel: boolean
  panelPosition: Position
  filters: ImageFilters
  colorAdjustments: ColorAdjustments
  isProcessing?: boolean
  onTogglePanel: () => void
  onPanelMouseDown: (e: React.MouseEvent) => void
  onFilterChange: (key: keyof ImageFilters, value: number) => void
  onColorAdjustmentChange: (key: keyof ColorAdjustments, value: number | boolean) => void
  onFilterCommit: (key: keyof ImageFilters, value: number) => void
  onColorAdjustmentCommit: (key: keyof ColorAdjustments, value: number | boolean) => void
  onResetAll: () => void
}

export const EditPanel = ({
  showEditPanel,
  panelPosition,
  filters,
  colorAdjustments,
  isProcessing,
  onTogglePanel,
  onPanelMouseDown,
  onFilterChange,
  onColorAdjustmentChange,
  onFilterCommit,
  onColorAdjustmentCommit,
  onResetAll,
}: EditPanelProps) => {
  if (!showEditPanel) {
    return (
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={onTogglePanel}
          className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className="absolute w-80 max-h-[calc(100vh-1rem)] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-y-auto select-none"
      style={{
        top: `${8 + panelPosition.y}px`,
        right: `${8 - panelPosition.x}px`,
      }}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between cursor-move" onMouseDown={onPanelMouseDown}>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Edit Options</h3>
            {isProcessing && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
          </div>
          <Button variant="ghost" size="sm" onClick={onTogglePanel} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Filters</h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label className="text-sm font-medium">Blur</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gaussian Blur</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-xs text-muted-foreground">{filters.blur}px</span>
              </div>
              <Slider
                value={[filters.blur]}
                onValueChange={(value) => onFilterChange('blur', value[0])}
                onValueCommit={(value) => onFilterCommit('blur', value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Sharpen</Label>
                <span className="text-xs text-muted-foreground">{filters.sharpen}</span>
              </div>
              <Slider
                value={[filters.sharpen]}
                onValueChange={(value) => onFilterChange('sharpen', value[0])}
                onValueCommit={(value) => onFilterCommit('sharpen', value[0])}
                max={5}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Pixelate</Label>
                <span className="text-xs text-muted-foreground">{filters.pixelate}px</span>
              </div>
              <Slider
                value={[filters.pixelate]}
                onValueChange={(value) => onFilterChange('pixelate', value[0])}
                onValueCommit={(value) => onFilterCommit('pixelate', value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Color Adjustments</h4>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="monochrome"
                checked={colorAdjustments.monochrome}
                onCheckedChange={(value) => {
                  onColorAdjustmentChange('monochrome', value)
                  onColorAdjustmentCommit('monochrome', value)
                }}
              />
              <Label htmlFor="monochrome" className="text-sm font-medium">
                Monochrome
              </Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Brightness</Label>
                <span className="text-xs text-muted-foreground">{colorAdjustments.brightness}%</span>
              </div>
              <Slider
                value={[colorAdjustments.brightness]}
                onValueChange={(value) => onColorAdjustmentChange('brightness', value[0])}
                onValueCommit={(value) => onColorAdjustmentCommit('brightness', value[0])}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Contrast</Label>
                <span className="text-xs text-muted-foreground">{colorAdjustments.contrast}%</span>
              </div>
              <Slider
                value={[colorAdjustments.contrast]}
                onValueChange={(value) => onColorAdjustmentChange('contrast', value[0])}
                onValueCommit={(value) => onColorAdjustmentCommit('contrast', value[0])}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Saturation</Label>
                <span className="text-xs text-muted-foreground">{colorAdjustments.saturation}%</span>
              </div>
              <Slider
                value={[colorAdjustments.saturation]}
                onValueChange={(value) => onColorAdjustmentChange('saturation', value[0])}
                onValueCommit={(value) => onColorAdjustmentCommit('saturation', value[0])}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Gamma</Label>
                <span className="text-xs text-muted-foreground">{colorAdjustments.gamma}%</span>
              </div>
              <Slider
                value={[colorAdjustments.gamma]}
                onValueChange={(value) => onColorAdjustmentChange('gamma', value[0])}
                onValueCommit={(value) => onColorAdjustmentCommit('gamma', value[0])}
                max={200}
                min={50}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onResetAll}>
            Reset All
          </Button>
        </div>
      </div>
    </div>
  )
}

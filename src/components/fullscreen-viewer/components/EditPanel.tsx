'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Settings } from 'lucide-react'
import { Position, ImageFilters, ColorAdjustments } from '../types'
import { DownloadPanel } from './DownloadPanel'
import { FiltersSection } from './FiltersSection'
import { ColorAdjustmentsSection } from './ColorAdjustmentsSection'
import { EditPanelHeader } from './EditPanelHeader'

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
  onFilterReset: (key: keyof ImageFilters) => void
  onColorAdjustmentReset: (key: keyof ColorAdjustments) => void
  onResetAll: () => void
  onDownload?: (format: 'png' | 'jpeg' | 'webp', quality?: number) => void
  onPreviewQuality?: (format: 'png' | 'jpeg' | 'webp', quality: number) => void
  selectedFormat?: 'png' | 'jpeg' | 'webp'
  jpegQuality?: number
  webpQuality?: number
  onFormatChange?: (format: 'png' | 'jpeg' | 'webp') => void
  onJpegQualityChange?: (quality: number) => void
  onWebpQualityChange?: (quality: number) => void
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
  onFilterReset,
  onColorAdjustmentReset,
  onResetAll,
  onDownload,
  onPreviewQuality,
  selectedFormat,
  jpegQuality,
  webpQuality,
  onFormatChange,
  onJpegQualityChange,
  onWebpQualityChange,
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
    <TooltipProvider>
      <div
        className="absolute w-80 max-h-[calc(100vh-1rem)] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-y-auto select-none"
        style={{
          top: `${8 + panelPosition.y}px`,
          right: `${8 - panelPosition.x}px`,
        }}
      >
        <div className="p-6 space-y-6">
          <EditPanelHeader isProcessing={isProcessing} onClose={onTogglePanel} onMouseDown={onPanelMouseDown} />

          <FiltersSection
            filters={filters}
            onFilterChange={onFilterChange}
            onFilterCommit={onFilterCommit}
            onFilterReset={onFilterReset}
          />

          <Separator />

          <ColorAdjustmentsSection
            colorAdjustments={colorAdjustments}
            onColorAdjustmentChange={onColorAdjustmentChange}
            onColorAdjustmentCommit={onColorAdjustmentCommit}
            onColorAdjustmentReset={onColorAdjustmentReset}
          />

          <Separator />

          {onDownload && onPreviewQuality && (
            <>
              <DownloadPanel
                onDownload={onDownload}
                onPreviewQuality={onPreviewQuality}
                isProcessing={isProcessing}
                selectedFormat={selectedFormat}
                jpegQuality={jpegQuality}
                webpQuality={webpQuality}
                onFormatChange={onFormatChange}
                onJpegQualityChange={onJpegQualityChange}
                onWebpQualityChange={onWebpQualityChange}
              />
              <Separator />
            </>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onResetAll}>
              Reset All
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

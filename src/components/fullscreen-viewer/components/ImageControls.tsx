'use client'

import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface ImageControlsProps {
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export const ImageControls = ({ scale, onZoomIn, onZoomOut, onReset }: ImageControlsProps) => {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
        <Button
          variant="secondary"
          size="sm"
          onClick={onZoomOut}
          className="bg-muted/50 hover:bg-muted border-border h-8 w-8 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <div className="text-foreground text-sm font-medium px-2">{Math.round(scale * 100)}%</div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onZoomIn}
          className="bg-muted/50 hover:bg-muted border-border h-8 w-8 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="bg-muted/50 hover:bg-muted border-border h-8 w-8 p-0"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { FullscreenImageViewerProps } from './types'
import { useImageViewer } from './hooks/useImageViewer'
import { usePanelDrag } from './hooks/usePanelDrag'
import { useImageFilters } from './hooks/useImageFilters'
import { DebugMenu } from './components/DebugMenu'
import { EditPanel } from './components/EditPanel'
import { ImageControls } from './components/ImageControls'

export default function FullscreenImageViewer({ imageUrl, imageName, isOpen, onClose }: FullscreenImageViewerProps) {
  const {
    viewerState,
    containerRef,
    imageRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    toggleEditPanel,
    toggleDebugMenu,
  } = useImageViewer(isOpen)

  const { panelPosition, handlePanelMouseDown, handlePanelMouseMove, handlePanelMouseUp, handleWindowResize } =
    usePanelDrag()

  const { filters, colorAdjustments, updateFilter, updateColorAdjustment, resetAll } = useImageFilters()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // onClose()
      }
    },
    [onClose]
  )

  const handleCombinedMouseUp = useCallback(() => {
    handleMouseUp()
    handlePanelMouseUp()
  }, [handleMouseUp, handlePanelMouseUp])

  useEffect(() => {
    if (isOpen) {
      const container = containerRef.current
      if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false })
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousemove', handlePanelMouseMove)
        document.addEventListener('mouseup', handleCombinedMouseUp)
        document.addEventListener('keydown', handleKeyDown)
        window.addEventListener('resize', handleWindowResize)

        return () => {
          container.removeEventListener('wheel', handleWheel)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mousemove', handlePanelMouseMove)
          document.removeEventListener('mouseup', handleCombinedMouseUp)
          document.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('resize', handleWindowResize)
        }
      }
    }
  }, [
    isOpen,
    handleWheel,
    handleMouseMove,
    handlePanelMouseMove,
    handleCombinedMouseUp,
    handleKeyDown,
    handleWindowResize,
  ])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm"
      style={{
        backgroundImage: `
        linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
        linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
        linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)
      `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: 'hsl(var(--background))',
      }}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-2 left-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border mr-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <DebugMenu showDebugMenu={viewerState.showDebugMenu} onToggle={toggleDebugMenu} />

        <ImageControls
          scale={viewerState.scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />

        <img
          ref={imageRef}
          src={imageUrl}
          alt={imageName || 'Fullscreen image'}
          className="absolute select-none pointer-events-none"
          style={{
            transform: `translate(${viewerState.position.x}px, ${viewerState.position.y}px) scale(${viewerState.scale}) translate(-50%, -50%)`,
            transformOrigin: '0 0',
            imageRendering: 'crisp-edges',
          }}
          draggable={false}
        />
      </div>

      <EditPanel
        showEditPanel={viewerState.showEditPanel}
        panelPosition={panelPosition}
        filters={filters}
        colorAdjustments={colorAdjustments}
        onTogglePanel={toggleEditPanel}
        onPanelMouseDown={handlePanelMouseDown}
        onFilterChange={updateFilter}
        onColorAdjustmentChange={updateColorAdjustment}
        onResetAll={resetAll}
      />
    </div>
  )
}

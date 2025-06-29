'use client'

import { useEffect, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'
import { FullscreenImageViewerProps } from './types'
import { useImageViewer } from './hooks/useImageViewer'
import { usePanelDrag } from './hooks/usePanelDrag'
import { useImageFilters } from './hooks/useImageFilters'
import { useImageProcessor } from './hooks/useImageProcessor'
import { DebugMenu } from './components/DebugMenu'
import { EditPanel } from './components/EditPanel'
import { ImageControls } from './components/ImageControls'
import { ImageFilters, ColorAdjustments } from './types'
import { DEFAULT_IMAGE_FILTERS, DEFAULT_COLOR_ADJUSTMENTS } from './constants'

export default function FullscreenImageViewer({ imageUrl, imageName, isOpen, onClose }: FullscreenImageViewerProps) {
  const {
    viewerState,
    containerRef,
    imageRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMoveNative,
    handleTouchEnd,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    toggleEditPanel,
    toggleDebugMenu,
  } = useImageViewer(isOpen)

  const { panelPosition, handlePanelMouseDown, handlePanelMouseMove, handlePanelMouseUp, handleWindowResize } =
    usePanelDrag()

  const {
    filters,
    colorAdjustments,
    updateFilter,
    updateColorAdjustment,
    resetFilter,
    resetColorAdjustment,
    resetAll,
  } = useImageFilters()

  const [committedFilters, setCommittedFilters] = useState<ImageFilters>(DEFAULT_IMAGE_FILTERS)

  const [committedColorAdjustments, setCommittedColorAdjustments] =
    useState<ColorAdjustments>(DEFAULT_COLOR_ADJUSTMENTS)

  const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [jpegQuality, setJpegQuality] = useState(90)
  const [webpQuality, setWebpQuality] = useState(90)

  const {
    downloadImage,
    updatePreview,
    previewUrl,
    isProcessing: isDownloadProcessing,
  } = useImageProcessor(imageUrl, imageName || undefined)

  const handleFilterCommit = useCallback((key: keyof ImageFilters, value: number) => {
    setCommittedFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleColorAdjustmentCommit = useCallback((key: keyof ColorAdjustments, value: number | boolean) => {
    setCommittedColorAdjustments((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleFilterReset = useCallback(
    (key: keyof ImageFilters) => {
      resetFilter(key)
      setCommittedFilters((prev) => ({ ...prev, [key]: DEFAULT_IMAGE_FILTERS[key] }))
    },
    [resetFilter]
  )

  const handleColorAdjustmentReset = useCallback(
    (key: keyof ColorAdjustments) => {
      resetColorAdjustment(key)
      setCommittedColorAdjustments((prev) => ({ ...prev, [key]: DEFAULT_COLOR_ADJUSTMENTS[key] }))
    },
    [resetColorAdjustment]
  )

  const handleResetAll = useCallback(() => {
    resetAll()
    setCommittedFilters(DEFAULT_IMAGE_FILTERS)
    setCommittedColorAdjustments(DEFAULT_COLOR_ADJUSTMENTS)
  }, [resetAll])

  const handleDownload = useCallback(
    (format: 'png' | 'jpeg' | 'webp', quality?: number) => {
      downloadImage(format, { filters: committedFilters, colorAdjustments: committedColorAdjustments }, quality)
    },
    [downloadImage, committedFilters, committedColorAdjustments]
  )

  const handlePreviewQuality = useCallback(
    (format: 'png' | 'jpeg' | 'webp', quality: number) => {
      updatePreview(format, quality, { filters: committedFilters, colorAdjustments: committedColorAdjustments })
    },
    [updatePreview, committedFilters, committedColorAdjustments]
  )

  const getCurrentQuality = useCallback(() => {
    if (selectedFormat === 'jpeg') return jpegQuality
    if (selectedFormat === 'webp') return webpQuality
    return 100
  }, [selectedFormat, jpegQuality, webpQuality])

  const handleFormatChange = useCallback((format: 'png' | 'jpeg' | 'webp') => {
    setSelectedFormat(format)
  }, [])

  const handleJpegQualityChange = useCallback((quality: number) => {
    setJpegQuality(quality)
  }, [])

  const handleWebpQualityChange = useCallback((quality: number) => {
    setWebpQuality(quality)
  }, [])

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

  const handleCombinedTouchEnd = useCallback(() => {
    handleTouchEnd()
    handlePanelMouseUp()
  }, [handleTouchEnd, handlePanelMouseUp])

  useEffect(() => {
    if (isOpen) {
      updatePreview(selectedFormat, getCurrentQuality(), {
        filters: committedFilters,
        colorAdjustments: committedColorAdjustments,
      })
    }
  }, [committedFilters, committedColorAdjustments])

  useEffect(() => {
    if (isOpen) {
      const container = containerRef.current
      if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false })
        container.addEventListener('touchstart', handleTouchStart, { passive: false })
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousemove', handlePanelMouseMove)
        document.addEventListener('mouseup', handleCombinedMouseUp)
        document.addEventListener('touchmove', handleTouchMoveNative, { passive: false })
        document.addEventListener('touchend', handleCombinedTouchEnd)
        document.addEventListener('keydown', handleKeyDown)
        window.addEventListener('resize', handleWindowResize)

        return () => {
          container.removeEventListener('wheel', handleWheel)
          container.removeEventListener('touchstart', handleTouchStart)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mousemove', handlePanelMouseMove)
          document.removeEventListener('mouseup', handleCombinedMouseUp)
          document.removeEventListener('touchmove', handleTouchMoveNative)
          document.removeEventListener('touchend', handleCombinedTouchEnd)
          document.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('resize', handleWindowResize)
        }
      }
    }
  }, [
    isOpen,
    handleWheel,
    handleTouchStart,
    handleMouseMove,
    handlePanelMouseMove,
    handleCombinedMouseUp,
    handleTouchMoveNative,
    handleCombinedTouchEnd,
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
          src={previewUrl || imageUrl}
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
        isProcessing={isDownloadProcessing}
        onTogglePanel={toggleEditPanel}
        onPanelMouseDown={handlePanelMouseDown}
        onFilterChange={updateFilter}
        onColorAdjustmentChange={updateColorAdjustment}
        onFilterCommit={handleFilterCommit}
        onColorAdjustmentCommit={handleColorAdjustmentCommit}
        onFilterReset={handleFilterReset}
        onColorAdjustmentReset={handleColorAdjustmentReset}
        onResetAll={handleResetAll}
        onDownload={handleDownload}
        onPreviewQuality={handlePreviewQuality}
        selectedFormat={selectedFormat}
        jpegQuality={jpegQuality}
        webpQuality={webpQuality}
        onFormatChange={handleFormatChange}
        onJpegQualityChange={handleJpegQualityChange}
        onWebpQualityChange={handleWebpQualityChange}
      />
    </div>
  )
}

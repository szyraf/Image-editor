'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { X, ZoomIn, ZoomOut, RotateCcw, Settings, Bug } from 'lucide-react'
import { useWasm } from '@/contexts/WasmContext'

interface FullscreenImageViewerProps {
  imageUrl: string
  imageName: string | null
  isOpen: boolean
  onClose: () => void
}

export default function FullscreenImageViewer({ imageUrl, imageName, isOpen, onClose }: FullscreenImageViewerProps) {
  const { instance, isLoading, error } = useWasm()

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 })
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showDebugMenu, setShowDebugMenu] = useState(false)

  // Filter options
  const [blur, setBlur] = useState(0)
  const [sharpen, setSharpen] = useState(0)
  const [pixelate, setPixelate] = useState(0)

  // Color adjustment options
  const [monochrome, setMonochrome] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()

      const delta = e.deltaY * -0.001
      const newScale = Math.max(0.1, Math.min(10, scale + delta))

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const scaleRatio = newScale / scale

        setPosition((prev) => ({
          x: centerX + (prev.x - centerX) * scaleRatio + (mouseX - centerX) * (1 - scaleRatio),
          y: centerY + (prev.y - centerY) * scaleRatio + (mouseY - centerY) * (1 - scaleRatio),
        }))
      }

      setScale(newScale)
    },
    [scale]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setDragStartPosition(position)
    },
    [position]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      setPosition({
        x: dragStartPosition.x + deltaX,
        y: dragStartPosition.y + deltaY,
      })
    },
    [isDragging, dragStart, dragStartPosition]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleZoomIn = () => {
    setScale((prev) => Math.min(10, prev * 1.2))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.1, prev / 1.2))
  }

  const handleReset = () => {
    setScale(1)
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPosition({
        x: rect.width / 2,
        y: rect.height / 2,
      })
    }
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      const container = containerRef.current
      if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false })
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
          container.removeEventListener('wheel', handleWheel)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          document.removeEventListener('keydown', handleKeyDown)
        }
      }
    }
  }, [isOpen, handleWheel, handleMouseMove, handleMouseUp, handleKeyDown])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPosition({
        x: rect.width / 2,
        y: rect.height / 2,
      })
    }
  }, [isOpen])

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
        className={`relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 ${
          showEditPanel ? 'pr-80' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Close Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border mr-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Debug Menu Toggle */}
        <div className="absolute bottom-6 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDebugMenu(!showDebugMenu)}
            className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border mb-2"
          >
            <Bug className="w-4 h-4" />
          </Button>
        </div>

        {/* Debug Menu */}
        {showDebugMenu && (
          <div className="absolute bottom-20 left-4 z-10 min-w-80">
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Debug Info</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDebugMenu(false)} className="h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <Separator />

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Greet Output:</span>
                  <span className="font-mono text-green-500">{instance?.greet() || 'No instance'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showEditPanel && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowEditPanel(!showEditPanel)}
              className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
              className="bg-muted/50 hover:bg-muted border-border h-8 w-8 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <div className="text-foreground text-sm font-medium px-2">{Math.round(scale * 100)}%</div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}
              className="bg-muted/50 hover:bg-muted border-border h-8 w-8 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="bg-muted/50 hover:bg-muted border-border h-8 w-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <img
          ref={imageRef}
          src={imageUrl}
          alt={imageName || 'Fullscreen image'}
          className="absolute select-none pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) translate(-50%, -50%)`,
            transformOrigin: '0 0',
            imageRendering: 'crisp-edges',
          }}
          draggable={false}
        />
      </div>

      {/* Edit Panel */}
      {showEditPanel && (
        <div className="absolute top-0 right-0 w-80 h-full bg-background/95 backdrop-blur-sm border-l border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Edit Options</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditPanel(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Filters</h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Blur</Label>
                    <span className="text-xs text-muted-foreground">{blur}px</span>
                  </div>
                  <Slider
                    value={[blur]}
                    onValueChange={(value) => setBlur(value[0])}
                    max={10}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Sharpen</Label>
                    <span className="text-xs text-muted-foreground">{sharpen}</span>
                  </div>
                  <Slider
                    value={[sharpen]}
                    onValueChange={(value) => setSharpen(value[0])}
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Pixelate</Label>
                    <span className="text-xs text-muted-foreground">{pixelate}px</span>
                  </div>
                  <Slider
                    value={[pixelate]}
                    onValueChange={(value) => setPixelate(value[0])}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Color Adjustments Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Color Adjustments</h4>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="monochrome" checked={monochrome} onCheckedChange={setMonochrome} />
                  <Label htmlFor="monochrome" className="text-sm font-medium">
                    Monochrome
                  </Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Brightness</Label>
                    <span className="text-xs text-muted-foreground">{brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Contrast</Label>
                    <span className="text-xs text-muted-foreground">{contrast}%</span>
                  </div>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Saturation</Label>
                    <span className="text-xs text-muted-foreground">{saturation}%</span>
                  </div>
                  <Slider
                    value={[saturation]}
                    onValueChange={(value) => setSaturation(value[0])}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Reset All
              </Button>
              <Button size="sm" className="flex-1">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

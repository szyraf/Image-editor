'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Download, Image as ImageIcon } from 'lucide-react'

interface DownloadPanelProps {
  onDownload: (format: 'png' | 'jpeg' | 'webp', quality?: number) => void
  onPreviewQuality: (format: 'png' | 'jpeg' | 'webp', quality: number) => void
  isProcessing?: boolean
  selectedFormat?: 'png' | 'jpeg' | 'webp'
  jpegQuality?: number
  webpQuality?: number
  onFormatChange?: (format: 'png' | 'jpeg' | 'webp') => void
  onJpegQualityChange?: (quality: number) => void
  onWebpQualityChange?: (quality: number) => void
}

export const DownloadPanel = ({
  onDownload,
  onPreviewQuality,
  isProcessing,
  selectedFormat: propSelectedFormat,
  jpegQuality: propJpegQuality,
  webpQuality: propWebpQuality,
  onFormatChange,
  onJpegQualityChange,
  onWebpQualityChange,
}: DownloadPanelProps) => {
  const selectedFormat = propSelectedFormat ?? 'png'
  const jpegQuality = propJpegQuality ?? 90
  const webpQuality = propWebpQuality ?? 90

  const handleFormatChange = (format: 'png' | 'jpeg' | 'webp') => {
    onFormatChange?.(format)
    if (format === 'jpeg') {
      onPreviewQuality(format, jpegQuality)
    } else if (format === 'webp') {
      onPreviewQuality(format, webpQuality)
    } else {
      onPreviewQuality(format, 100)
    }
  }

  const handleDownload = () => {
    if (selectedFormat === 'png') {
      onDownload('png')
    } else if (selectedFormat === 'jpeg') {
      onDownload('jpeg', jpegQuality)
    } else if (selectedFormat === 'webp') {
      onDownload('webp', webpQuality)
    }
  }

  const getQualityDescription = (quality: number) => {
    if (quality >= 90) return 'Excellent'
    if (quality >= 75) return 'Very Good'
    if (quality >= 60) return 'Good'
    if (quality >= 40) return 'Fair'
    return 'Poor'
  }

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'png':
        return 'Lossless, larger file size, supports transparency'
      case 'jpeg':
        return 'Lossy compression, smaller file size, no transparency'
      case 'webp':
        return 'Modern format, better compression, supports transparency'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        <h4 className="font-medium text-foreground">Download Options</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Format</Label>
          <div className="flex gap-1">
            <Button
              variant={selectedFormat === 'png' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFormatChange('png')}
              className="flex-1"
            >
              PNG
            </Button>
            <Button
              variant={selectedFormat === 'jpeg' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFormatChange('jpeg')}
              className="flex-1"
            >
              JPEG
            </Button>
            <Button
              variant={selectedFormat === 'webp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFormatChange('webp')}
              className="flex-1"
            >
              WebP
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{getFormatDescription(selectedFormat)}</p>
        </div>

        {selectedFormat === 'jpeg' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">JPEG Quality</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{jpegQuality}%</span>
                <span className="text-xs text-muted-foreground">({getQualityDescription(jpegQuality)})</span>
              </div>
            </div>
            <Slider
              value={[jpegQuality]}
              onValueChange={(value) => onJpegQualityChange?.(value[0])}
              onValueCommit={(value) => onPreviewQuality('jpeg', value[0])}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {selectedFormat === 'webp' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">WebP Quality</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{webpQuality}%</span>
                <span className="text-xs text-muted-foreground">({getQualityDescription(webpQuality)})</span>
              </div>
            </div>
            <Slider
              value={[webpQuality]}
              onValueChange={(value) => onWebpQualityChange?.(value[0])}
              onValueCommit={(value) => onPreviewQuality('webp', value[0])}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {selectedFormat === 'png' && (
          <div className="rounded-md border border-border p-3 bg-muted/50">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                PNG uses lossless compression with maximum quality (100%)
              </span>
            </div>
          </div>
        )}

        <Button onClick={handleDownload} disabled={isProcessing} className="w-full">
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download as {selectedFormat.toUpperCase()}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

import { useState, useRef, useCallback, useEffect } from 'react'
import { ViewerState, Position } from '../types'

export const useImageViewer = (isOpen: boolean) => {
  const [viewerState, setViewerState] = useState<ViewerState>({
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    dragStartPosition: { x: 0, y: 0 },
    showEditPanel: true,
    showDebugMenu: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()

      const delta = e.deltaY * -0.001
      const newScale = Math.max(0.1, Math.min(10, viewerState.scale + delta))

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const scaleRatio = newScale / viewerState.scale

        setViewerState((prev) => ({
          ...prev,
          scale: newScale,
          position: {
            x: centerX + (prev.position.x - centerX) * scaleRatio + (mouseX - centerX) * (1 - scaleRatio),
            y: centerY + (prev.position.y - centerY) * scaleRatio + (mouseY - centerY) * (1 - scaleRatio),
          },
        }))
      }
    },
    [viewerState.scale]
  )

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setViewerState((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY },
      dragStartPosition: prev.position,
    }))
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!viewerState.isDragging) return

      const deltaX = e.clientX - viewerState.dragStart.x
      const deltaY = e.clientY - viewerState.dragStart.y

      setViewerState((prev) => ({
        ...prev,
        position: {
          x: prev.dragStartPosition.x + deltaX,
          y: prev.dragStartPosition.y + deltaY,
        },
      }))
    },
    [viewerState.isDragging, viewerState.dragStart, viewerState.dragStartPosition]
  )

  const handleMouseUp = useCallback(() => {
    setViewerState((prev) => ({
      ...prev,
      isDragging: false,
    }))
  }, [])

  const handleZoomIn = () => {
    setViewerState((prev) => ({
      ...prev,
      scale: Math.min(10, prev.scale * 1.2),
    }))
  }

  const handleZoomOut = () => {
    setViewerState((prev) => ({
      ...prev,
      scale: Math.max(0.1, prev.scale / 1.2),
    }))
  }

  const handleReset = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setViewerState((prev) => ({
        ...prev,
        scale: 1,
        position: {
          x: rect.width / 2,
          y: rect.height / 2,
        },
      }))
    }
  }

  const toggleEditPanel = () => {
    setViewerState((prev) => ({
      ...prev,
      showEditPanel: !prev.showEditPanel,
    }))
  }

  const toggleDebugMenu = () => {
    setViewerState((prev) => ({
      ...prev,
      showDebugMenu: !prev.showDebugMenu,
    }))
  }

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setViewerState((prev) => ({
        ...prev,
        position: {
          x: rect.width / 2,
          y: rect.height / 2,
        },
      }))
    }
  }, [isOpen])

  return {
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
  }
}

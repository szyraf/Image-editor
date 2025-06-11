import { useState, useRef, useCallback, useEffect } from 'react'
import { ViewerState, Position } from '../types'

interface TouchState {
  isTouching: boolean
  touchStart: Position[]
  touchStartPosition: Position
  initialDistance: number
  initialScale: number
}

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

  const [touchState, setTouchState] = useState<TouchState>({
    isTouching: false,
    touchStart: [],
    touchStartPosition: { x: 0, y: 0 },
    initialDistance: 0,
    initialScale: 1,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const getTouchDistance = (touches: Touch[]) => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (touches: Touch[]) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY }
    }
    const x = (touches[0].clientX + touches[1].clientX) / 2
    const y = (touches[0].clientY + touches[1].clientY) / 2
    return { x, y }
  }

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touches = Array.from(e.touches)

      if (touches.length === 1) {
        setTouchState({
          isTouching: true,
          touchStart: [{ x: touches[0].clientX, y: touches[0].clientY }],
          touchStartPosition: viewerState.position,
          initialDistance: 0,
          initialScale: viewerState.scale,
        })
      } else if (touches.length === 2) {
        const distance = getTouchDistance(touches)
        const center = getTouchCenter(touches)

        setTouchState({
          isTouching: true,
          touchStart: touches.map((t) => ({ x: t.clientX, y: t.clientY })),
          touchStartPosition: viewerState.position,
          initialDistance: distance,
          initialScale: viewerState.scale,
        })
      }
    },
    [viewerState.position, viewerState.scale]
  )

  const handleTouchMoveNative = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      if (!touchState.isTouching) return

      const touches = Array.from(e.touches)

      if (touches.length === 1 && touchState.touchStart.length === 1) {
        const deltaX = touches[0].clientX - touchState.touchStart[0].x
        const deltaY = touches[0].clientY - touchState.touchStart[0].y

        setViewerState((prev) => ({
          ...prev,
          position: {
            x: touchState.touchStartPosition.x + deltaX,
            y: touchState.touchStartPosition.y + deltaY,
          },
        }))
      } else if (touches.length === 2 && touchState.touchStart.length === 2) {
        const currentDistance = getTouchDistance(touches)
        const scaleRatio = currentDistance / touchState.initialDistance
        const newScale = Math.max(0.1, Math.min(10, touchState.initialScale * scaleRatio))

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const centerX = rect.width / 2
          const centerY = rect.height / 2

          const touchCenter = getTouchCenter(touches)
          const touchX = touchCenter.x - rect.left
          const touchY = touchCenter.y - rect.top

          const finalScaleRatio = newScale / viewerState.scale

          setViewerState((prev) => ({
            ...prev,
            scale: newScale,
            position: {
              x: centerX + (prev.position.x - centerX) * finalScaleRatio + (touchX - centerX) * (1 - finalScaleRatio),
              y: centerY + (prev.position.y - centerY) * finalScaleRatio + (touchY - centerY) * (1 - finalScaleRatio),
            },
          }))
        }
      }
    },
    [touchState, viewerState.scale]
  )

  const handleTouchEnd = useCallback(() => {
    setTouchState({
      isTouching: false,
      touchStart: [],
      touchStartPosition: { x: 0, y: 0 },
      initialDistance: 0,
      initialScale: 1,
    })
  }, [])

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
    handleTouchStart,
    handleTouchMoveNative,
    handleTouchEnd,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    toggleEditPanel,
    toggleDebugMenu,
  }
}

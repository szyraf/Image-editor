import { useState, useCallback } from 'react'
import { Position, PanelState } from '../types'
import { constrainPanelPosition } from '../utils/panelConstraints'

export const usePanelDrag = () => {
  const [panelState, setPanelState] = useState<PanelState>({
    panelPosition: { x: 0, y: 0 },
    isPanelDragging: false,
    panelDragStart: { x: 0, y: 0 },
    panelDragStartPosition: { x: 0, y: 0 },
  })

  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPanelState((prev) => ({
      ...prev,
      isPanelDragging: true,
      panelDragStart: { x: e.clientX, y: e.clientY },
      panelDragStartPosition: prev.panelPosition,
    }))
  }, [])

  const handlePanelMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!panelState.isPanelDragging) return

      const deltaX = e.clientX - panelState.panelDragStart.x
      const deltaY = e.clientY - panelState.panelDragStart.y

      const newPosition = {
        x: panelState.panelDragStartPosition.x + deltaX,
        y: panelState.panelDragStartPosition.y + deltaY,
      }

      setPanelState((prev) => ({
        ...prev,
        panelPosition: constrainPanelPosition(newPosition),
      }))
    },
    [panelState.isPanelDragging, panelState.panelDragStart, panelState.panelDragStartPosition]
  )

  const handlePanelMouseUp = useCallback(() => {
    setPanelState((prev) => ({
      ...prev,
      isPanelDragging: false,
    }))
  }, [])

  const handleWindowResize = useCallback(() => {
    setPanelState((prev) => ({
      ...prev,
      panelPosition: constrainPanelPosition(prev.panelPosition),
    }))
  }, [])

  return {
    panelPosition: panelState.panelPosition,
    handlePanelMouseDown,
    handlePanelMouseMove,
    handlePanelMouseUp,
    handleWindowResize,
  }
}

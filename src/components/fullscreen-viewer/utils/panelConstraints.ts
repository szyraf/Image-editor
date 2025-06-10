import { Position } from '../types'

export const constrainPanelPosition = (newPosition: Position): Position => {
  const panelWidth = 320
  const panelHeight = Math.min(window.innerHeight - 24, 600)
  const margin = 8

  const maxX = window.innerWidth - panelWidth - margin
  const maxY = window.innerHeight - panelHeight - margin

  return {
    x: Math.max(-maxX + margin, Math.min(margin, newPosition.x)),
    y: Math.max(-margin, Math.min(maxY - margin, newPosition.y)),
  }
}

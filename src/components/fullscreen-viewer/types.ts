export interface FullscreenImageViewerProps {
  imageUrl: string
  imageName: string | null
  isOpen: boolean
  onClose: () => void
}

export interface Position {
  x: number
  y: number
}

export interface ImageFilters {
  blur: number
  sharpen: number
  pixelate: number
}

export interface ColorAdjustments {
  monochrome: boolean
  brightness: number
  contrast: number
  saturation: number
  gamma: number
}

export interface ViewerState {
  scale: number
  position: Position
  isDragging: boolean
  dragStart: Position
  dragStartPosition: Position
  showEditPanel: boolean
  showDebugMenu: boolean
}

export interface PanelState {
  panelPosition: Position
  isPanelDragging: boolean
  panelDragStart: Position
  panelDragStartPosition: Position
}

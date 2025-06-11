'use client'

import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'

interface EditPanelHeaderProps {
  isProcessing?: boolean
  onClose: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

export const EditPanelHeader = ({ isProcessing, onClose, onMouseDown }: EditPanelHeaderProps) => {
  return (
    <div className="flex items-center justify-between cursor-move" onMouseDown={onMouseDown}>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">Edit Options</h3>
        {isProcessing && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
      </div>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

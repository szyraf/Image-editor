'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X, Bug } from 'lucide-react'
import { useWasm } from '@/contexts/WasmContext'

interface DebugMenuProps {
  showDebugMenu: boolean
  onToggle: () => void
}

export const DebugMenu = ({ showDebugMenu, onToggle }: DebugMenuProps) => {
  const { instance } = useWasm()

  return (
    <>
      <div className="absolute bottom-2 left-2 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggle}
          className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border mb-2"
        >
          <Bug className="w-4 h-4" />
        </Button>
      </div>

      {showDebugMenu && (
        <div className="absolute bottom-16 left-2 z-10 min-w-80">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Debug Info</h3>
              <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Greet Output:</span>
                <span className="font-mono text-green-500">{instance?.greet() || 'No instance'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Greet Output:</span>
                <span className="font-mono text-green-500">{instance?.greet2() || 'No instance'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface MonochromeToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  onCommit: (value: boolean) => void
}

export const MonochromeToggle = ({ checked, onChange, onCommit }: MonochromeToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="monochrome"
        checked={checked}
        onCheckedChange={(value) => {
          onChange(value)
          onCommit(value)
        }}
      />
      <Label htmlFor="monochrome" className="text-sm font-medium">
        Monochrome
      </Label>
    </div>
  )
}

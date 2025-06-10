import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWasm } from '@/contexts/WasmContext'

export default function WasmHello() {
  const { instance } = useWasm()

  if (!instance) {
    return <p>No wasm instance :C</p>
  }

  const message = instance.greet()

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>WASM Test</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}

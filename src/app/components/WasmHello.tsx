import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WasmHello({ instance }: { instance: any }) {
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

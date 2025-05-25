import WasmHello from './components/WasmHello'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">WebAssembly Demo</h1>
      <WasmHello />
    </main>
  )
}

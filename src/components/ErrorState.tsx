import { Card, CardContent } from '@/components/ui/card'

interface ErrorStateProps {
  message?: string
}

export default function ErrorState({ message = 'An error occurred' }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}

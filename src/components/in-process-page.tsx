import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconTool, IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

interface InProcessPageProps {
  title: string
  description?: string
  expectedFeatures?: string[]
}

export function InProcessPage({ 
  title, 
  description = "This feature is currently under development", 
  expectedFeatures = [] 
}: InProcessPageProps) {
  return (
    <div className="flex-1 space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <IconTool className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-lg">
              {description}
            </CardDescription>
            <Badge variant="outline" className="mx-auto w-fit">
              🚧 In Development
            </Badge>
          </CardHeader>
          
          {expectedFeatures.length > 0 && (
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-center">Upcoming Features:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {expectedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Stay tuned for updates!
                </p>
                <Link href="/dashboard">
                  <Button>
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
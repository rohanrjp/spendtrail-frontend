import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{icon}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}


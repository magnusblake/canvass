import Link from "next/link"
import { Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  title: string
  description: string
  price: string
  duration: string
  features: string[]
  buttonText: string
  buttonLink?: string
  buttonVariant?: "default" | "outline" | "secondary"
  popular?: boolean
  disabled?: boolean
  badge?: string
}

export default function PricingCard({
  title,
  description,
  price,
  duration,
  features,
  buttonText,
  buttonLink = "#",
  buttonVariant = "default",
  popular = false,
  disabled = false,
  badge,
}: PricingCardProps) {
  return (
    <Card className={cn("flex flex-col h-full", popular && "border-primary shadow-lg")}>
      <CardHeader className="flex flex-col items-start gap-4 pb-4">
        {popular && (
          <Badge variant="default" className="bg-primary">
            Рекомендуемый
          </Badge>
        )}
        {badge && !popular && <Badge variant="outline">{badge}</Badge>}
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">{duration}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} className="w-full" asChild={!disabled} disabled={disabled}>
          {!disabled ? <Link href={buttonLink}>{buttonText}</Link> : buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}


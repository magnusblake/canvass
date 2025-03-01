import Image from "next/image"
import type { Award } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

interface UserAwardsProps {
  awards: Award[]
}

export default function UserAwards({ awards }: UserAwardsProps) {
  return (
    <div className="space-y-6">
      {awards.map((award) => (
        <div key={award.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image src={award.image} alt={award.title} fill className="object-cover rounded-lg" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{award.title}</h3>
            <p className="text-sm text-muted-foreground">{award.description}</p>
            <div className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(award.date), { addSuffix: true, locale: ru })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


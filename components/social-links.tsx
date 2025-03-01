import { FaVk, FaBehance, FaTelegram } from "react-icons/fa"
import { Button } from "./ui/button"

interface SocialLinksProps {
  vk?: string | null
  behance?: string | null
  telegram?: string | null
}

export default function SocialLinks({ vk, behance, telegram }: SocialLinksProps) {
  return (
    <div className="flex items-center justify-center gap-3 w-full">
      {vk && (
        <Button size="icon" variant="outline" asChild className="rounded-full" aria-label="VK">
          <a href={vk} target="_blank" rel="noopener noreferrer">
            <FaVk />
          </a>
        </Button>
      )}

      {behance && (
        <Button size="icon" variant="outline" asChild className="rounded-full" aria-label="Behance">
          <a href={behance} target="_blank" rel="noopener noreferrer">
            <FaBehance />
          </a>
        </Button>
      )}

      {telegram && (
        <Button size="icon" variant="outline" asChild className="rounded-full" aria-label="Telegram">
          <a href={telegram} target="_blank" rel="noopener noreferrer">
            <FaTelegram />
          </a>
        </Button>
      )}
    </div>
  )
}


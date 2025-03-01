import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import ProfileBadge from "./premium-badge"

interface CommentProps {
  comment: {
    id: string
    content: string
    userId: string
    projectId: string
    createdAt: string
    userName: string
    userImage: string | null
    userPremium: boolean
  }
}

export default function CommentItem({ comment }: CommentProps) {
  return (
    <div className="flex gap-4">
      <Link href={`/profile/${comment.userId}`} className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={comment.userImage || `/api/avatar?name=${encodeURIComponent(comment.userName)}`}
            alt={comment.userName}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Link href={`/profile/${comment.userId}`} className="font-medium hover:text-primary">
            {comment.userName}
          </Link>
          {comment.userPremium && <ProfileBadge type="premium" size="sm" />}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ru })}
          </span>
        </div>

        <div className="text-sm">{comment.content}</div>
      </div>
    </div>
  )
}


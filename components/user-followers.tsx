import Image from "next/image"
import Link from "next/link"
import type { User } from "@/lib/types"
import { Button } from "./ui/button"
import ProfileBadge from "./premium-badge"

interface UserFollowersProps {
  users: User[]
}

export default function UserFollowers({ users }: UserFollowersProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={user.image || `/api/avatar?name=${encodeURIComponent(user.name)}`}
              alt={user.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{user.name}</h3>
              {user.premium && <ProfileBadge type="premium" size="sm" />}
            </div>
            {user.bio && <p className="text-sm text-muted-foreground truncate">{user.bio}</p>}
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/profile/${user.id}`}>Профиль</Link>
          </Button>
        </div>
      ))}
    </div>
  )
}


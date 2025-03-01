// app/profile/[id]/page.tsx
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { getUserById, isFollowing } from "@/lib/data"
import db from "@/lib/db"
import { Heart, Eye, Calendar, MapPin, Mail, User as UserIcon, Award, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import ProfileBadge from "@/components/premium-badge"
import UserGallery from "@/components/user-gallery"
import SocialLinks from "@/components/social-links"
import FollowButton from "@/components/follow-button"
import { getSession } from "@/lib/auth"
import UserAwards from "@/components/user-awards"
import UserFollowers from "@/components/user-followers"
import EditProfileButton from "@/components/edit-profile-button"
import PremiumToggle from "@/components/premium-toggle"
import UserRecommendations from "@/components/user-recommendations"

interface ProfilePageProps {
  params: {
    id: string
  }
}

// Добавляем функцию для статического экспорта
export async function generateStaticParams() {
  const users = db.prepare('SELECT id FROM users').all();
  return users.map(user => ({
    id: user.id
  }));
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = await getUserById(params.id);

  if (!user) {
    return {
      title: "Пользователь не найден | Canvas",
    }
  }

  return {
    title: `${user.name} | Canvas`,
    description: `Профиль дизайнера ${user.name} на платформе Canvas`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserById(params.id);
  const session = await getSession();
  const isCurrentUser = session?.user?.id === params.id;
  const isUserFollowing = session?.user ? await isFollowing(session.user.id, params.id) : false;

  if (!user) {
    notFound()
  }

  const totalProjects = user.projects?.length || 0;
  const totalLikes = user.projects?.reduce((acc, project) => acc + project.likes, 0) || 0;
  const totalFollowers = user.followers?.length || 0;
  const totalFollowing = user.following?.length || 0;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Banner */}
      <div className="mb-24 relative">
        <div className="w-full h-48 md:h-64 lg:h-80 bg-gradient-to-r from-primary/10 to-primary/5">
          {user.banner && (
            <Image
              src={user.banner}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4" style={{ marginTop: "-6rem" }}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4 ring-4 ring-background">
                  <Image
                    src={user.image || `/api/avatar?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover bg-secondary"
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {user.premium && <ProfileBadge type="premium" />}
                  {!user.premium && <ProfileBadge type="standard" />}
                </div>
                
                <p className="text-muted-foreground mb-4">Дизайнер</p>
                
                {!isCurrentUser && (
                  <FollowButton 
                    userId={params.id} 
                    initialIsFollowing={isUserFollowing}
                    className="mb-4 w-full"
                  />
                )}
                
                {isCurrentUser && (
                  <EditProfileButton className="mb-4 w-full" />
                )}
                
                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold">{totalFollowers}</span>
                    <span className="text-sm text-muted-foreground">Подписчиков</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold">{totalFollowing}</span>
                    <span className="text-sm text-muted-foreground">Подписок</span>
                  </div>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold">{totalProjects}</span>
                    <span className="text-sm text-muted-foreground">Проектов</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold">{totalLikes}</span>
                    <span className="text-sm text-muted-foreground">Лайков</span>
                  </div>
                </div>
                
                <div className="w-full space-y-3 mb-6 text-left">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    На платформе с {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  
                  {user.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      {user.email}
                    </div>
                  )}
                  
                  {user.country && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      {user.country}
                    </div>
                  )}
                </div>
                
                {(user.vkLink || user.behanceLink || user.telegramLink) && (
                  <SocialLinks
                    vk={user.vkLink}
                    behance={user.behanceLink}
                    telegram={user.telegramLink}
                  />
                )}
                
                {isCurrentUser && (
                  <div className="mt-6">
                    <PremiumToggle />
                  </div>
                )}
                
                {/* Рекомендации пользователей */}
                {session?.user && !isCurrentUser && (
                  <div className="mt-6">
                    <UserRecommendations />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="projects" className="bg-card rounded-lg border shadow-sm p-6">
              <TabsList className="mb-6 grid grid-cols-4 gap-4">
                <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Проекты
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  О себе
                </TabsTrigger>
                <TabsTrigger value="awards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Награды
                </TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Сеть
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <h2 className="text-xl font-semibold mb-4">Все проекты</h2>
                {user.projects && user.projects.length > 0 ? (
                  <UserGallery projects={user.projects} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    У пользователя пока нет проектов
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about">
                <h2 className="text-xl font-semibold mb-4">О пользователе</h2>
                {user.bio ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{user.bio}</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Пользователь еще не добавил информацию о себе
                  </div>
                )}
                
                {user.interests && user.interests.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-8 mb-4">Интересы</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest) => (
                        <span key={interest} className="bg-secondary px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="awards">
                <h2 className="text-xl font-semibold mb-4">Награды и достижения</h2>
                {user.awards && user.awards.length > 0 ? (
                  <UserAwards awards={user.awards} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    У пользователя пока нет наград
                  </div>
                )}
              </TabsContent>

              <TabsContent value="network">
                <h2 className="text-xl font-semibold mb-4">Подписчики и подписки</h2>
                <Tabs defaultValue="followers">
                  <TabsList className="mb-4">
                    <TabsTrigger value="followers">
                      Подписчики ({totalFollowers})
                    </TabsTrigger>
                    <TabsTrigger value="following">
                      Подписки ({totalFollowing})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="followers">
                    {user.followers && user.followers.length > 0 ? (
                      <UserFollowers users={user.followers} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        У пользователя пока нет подписчиков
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="following">
                    {user.following && user.following.length > 0 ? (
                      <UserFollowers users={user.following} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Пользователь пока ни на кого не подписан
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
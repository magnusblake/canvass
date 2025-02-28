"use client"

import { getUserById, getProjectsByUserId, getSubscriptionsByUserId, getFollowersByUserId } from "@/lib/data"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectGrid from "@/components/project-grid"
import { Badge } from "@/components/ui/badge"
import { Instagram, Twitter, Dribbble, Mail, Calendar, Users, UserPlus } from "lucide-react"
import Link from "next/link"
import AwardsList from "@/components/awards-list"
import SubscriptionsList from "@/components/subscriptions-list"
import RecentActivity from "@/components/recent-activity"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect } from "react"

// Добавим фиктивные данные для последней активности
const recentActivities = [
  {
    id: "1",
    type: "project" as const,
    content: "Создал новый проект",
    date: "2 часа назад",
    projectId: "project1",
    projectTitle: "Новый дизайн приложения",
    projectImage: "/projects/project1.jpg",
  },
  {
    id: "2",
    type: "like" as const,
    content: "Поставил лайк проекту",
    date: "5 часов назад",
  },
  {
    id: "3",
    type: "comment" as const,
    content: "Прокомментировал проект",
    date: "1 день назад",
  },
]

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = getUserById(params.id)
  const projects = getProjectsByUserId(params.id)
  const subscriptions = getSubscriptionsByUserId(params.id)
  const followers = getFollowersByUserId(params.id)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!user) {
    notFound()
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={user.coverImageUrl || `/placeholder.svg?height=414&width=1390`}
          alt={`${user.name} cover`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <motion.div
          className="absolute inset-0 bg-primary/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            backgroundSize: ["100% 100%", "200% 200%"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 20,
          }}
          style={{
            backgroundImage: "url('/pattern.svg')",
          }}
        />
      </div>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 md:-mt-16 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-32 h-32 sm:w-40 sm:h-40 relative rounded-full overflow-hidden border-4 border-background shadow-lg"
          >
            <Image
              src={user.avatarUrl || `/placeholder.svg?height=160&width=160`}
              alt={user.name}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-2"
            >
              <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
              <Badge variant={user.subscriptionType === "premium" ? "default" : "secondary"}>
                {user.subscriptionType === "premium" ? "Премиум" : "Стандарт"}
              </Badge>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2"
            >
              <Mail className="h-4 w-4" />
              {user.email}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-4 justify-center md:justify-start"
            >
              <div className="flex items-center gap-1">
                <span className="font-bold">{projects.length}</span> проектов
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-bold">{user.followers}</span> подписчиков
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span className="font-bold">{user.following}</span> подписок
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Регистрация: {new Date(user.registrationDate).toLocaleDateString()}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 mb-6 justify-center md:justify-start"
            >
              {user.socialLinks.instagram && (
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-6 w-6" />
                  </Link>
                </motion.div>
              )}
              {user.socialLinks.twitter && (
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-6 w-6" />
                  </Link>
                </motion.div>
              )}
              {user.socialLinks.dribbble && (
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link href={user.socialLinks.dribbble} target="_blank" rel="noopener noreferrer">
                    <Dribbble className="h-6 w-6" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button>Подписаться</Button>
            </motion.div>
          </div>
        </motion.div>

        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="about">О пользователе</TabsTrigger>
            <TabsTrigger value="awards">Награды</TabsTrigger>
            <TabsTrigger value="subscriptions">Подписки</TabsTrigger>
            <TabsTrigger value="followers">Подписчики</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <ProjectGrid projects={projects} />
          </TabsContent>
          <TabsContent value="about">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">О {user.name}</h2>
              <p className="text-sm sm:text-base">{user.about}</p>
              <div>
                <h3 className="text-xl font-bold mb-2">Навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Badge variant="secondary">{skill}</Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="awards">
            <AwardsList awards={user.awards} />
          </TabsContent>
          <TabsContent value="subscriptions">
            <SubscriptionsList subscriptions={subscriptions} />
          </TabsContent>
          <TabsContent value="followers">
            <SubscriptionsList subscriptions={followers} />
          </TabsContent>
          <TabsContent value="activity">
            <RecentActivity activities={recentActivities} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}


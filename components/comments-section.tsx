"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card } from "./ui/card"
import { Separator } from "./ui/separator"
import { toast } from "sonner"
import CommentItem from "./comment-item"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  content: string
  userId: string
  projectId: string
  createdAt: string
  userName: string
  userImage: string | null
  userPremium: boolean
}

interface CommentsSectionProps {
  projectId: string
}

export default function CommentsSection({ projectId }: CommentsSectionProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [projectId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`)

      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/login")
      return
    }

    if (!commentText.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments((prev) => [newComment, ...prev])
        setCommentText("")
        toast.success("Комментарий добавлен")
      } else {
        toast.error("Не удалось добавить комментарий")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Комментарии ({comments.length})</h2>

      <Card className="p-4">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder={user ? "Напишите комментарий..." : "Войдите, чтобы оставить комментарий"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user || isSubmitting}
            className="mb-4 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!user || isSubmitting || !commentText.trim()}>
              {isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          </div>
        </form>
      </Card>

      <Separator />

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full"></div>
            <p className="mt-2 text-muted-foreground">Загрузка комментариев...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Пока нет комментариев. Будьте первым!</p>
          </div>
        )}
      </div>
    </div>
  )
}


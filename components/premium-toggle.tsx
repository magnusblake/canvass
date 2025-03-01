"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Crown, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

export default function PremiumToggle() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const handleTogglePremium = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/premium`, {
        method: "POST",
      })
      
      if (response.ok) {
        const data = await response.json()
        updateUser({ premium: data.premium })
        
        if (data.premium) {
          toast.success("Премиум статус активирован!", {
            icon: <Crown className="h-4 w-4 text-yellow-500" />
          })
        } else {
          toast.success("Премиум статус деактивирован")
        }
        
        router.refresh()
        setIsDialogOpen(false)
      } else {
        toast.error("Не удалось изменить премиум статус")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!user) return null
  
  return (
    <>
      <Button 
        variant={user.premium ? "outline" : "default"}
        onClick={() => setIsDialogOpen(true)}
        className="gap-2"
      >
        {user.premium ? (
          <>
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Премиум активен</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Получить премиум</span>
          </>
        )}
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.premium ? "Отключить премиум-статус?" : "Активировать премиум-статус?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.premium 
                ? "Вы уверены, что хотите отключить премиум-статус? Вы потеряете доступ к эксклюзивным функциям." 
                : "Премиум-статус откроет вам доступ к эксклюзивным функциям, расширенной статистике и уберёт все ограничения."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTogglePremium}
              disabled={isLoading}
              className={user.premium ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {isLoading 
                ? "Обработка..." 
                : user.premium 
                  ? "Отключить" 
                  : "Активировать"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
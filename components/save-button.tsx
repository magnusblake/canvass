"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  projectId: string;
  className?: string;
}

export default function SaveButton({ projectId, className }: SaveButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  useEffect(() => {
    // Проверяем, сохранен ли проект пользователем
    const checkSavedStatus = async () => {
      if (!user) {
        setInitialCheckDone(true);
        return;
      }
 
      try {
        const response = await fetch(`/api/projects/${projectId}/save`);
        
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.saved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setInitialCheckDone(true);
      }
    };
 
    checkSavedStatus();
  }, [projectId, user]);
 
  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
 
    setIsLoading(true);
 
    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
        
        if (data.saved) {
          toast.success("Проект сохранен");
        } else {
          toast.success("Проект удален из сохраненных");
        }
        
        router.refresh();
      } else {
        toast.error("Не удалось выполнить действие");
      }
    } catch (error) {
      toast.error("Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };
 
  if (!initialCheckDone) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("w-10 h-10 rounded-full", className)}
        disabled
      >
        <Bookmark className="h-5 w-5" />
      </Button>
    );
  }
 
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "w-10 h-10 rounded-full",
        isSaved && "bg-primary/10 text-primary border-primary/50",
        className
      )}
      onClick={handleSave}
      disabled={isLoading}
      aria-label={isSaved ? "Удалить из сохраненных" : "Сохранить проект"}
    >
      <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
    </Button>
  );
 }
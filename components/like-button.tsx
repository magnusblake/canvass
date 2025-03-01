"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  projectId: string;
  initialLikes: number;
  variant?: "default" | "icon";
  className?: string;
}

export default function LikeButton({ 
  projectId, 
  initialLikes,
  variant = "default",
  className 
}: LikeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Check if the user has already liked the project
    const checkLikeStatus = async () => {
      if (!user) {
        setInitialCheckDone(true);
        return;
      }

      try {
        // This endpoint doesn't exist yet, so let's create it
        const response = await fetch(`/api/projects/${projectId}/like/status`);
        
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.liked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkLikeStatus();
  }, [projectId, user]);

  const handleLike = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setIsLiking(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.liked) {
          setLikes((prev) => prev + 1);
          setIsLiked(true);
          toast.success("Добавлено в избранное");
        } else {
          setLikes((prev) => prev - 1);
          setIsLiked(false);
          toast.success("Удалено из избранного");
        }
        
        // Refresh the page to update any other components
        router.refresh();
      } else {
        toast.error("Не удалось выполнить действие");
      }
    } catch (error) {
      toast.error("Произошла ошибка");
    } finally {
      setIsLiking(false);
    }
  };

  if (!initialCheckDone) {
    // Show a loading state until we know if the user has liked the project
    if (variant === "icon") {
      return (
        <Button
          variant="outline"
          size="icon"
          className={cn("w-10 h-10 rounded-full", className)}
          disabled
        >
          <Heart className="h-5 w-5" />
        </Button>
      );
    }
    
    return (
      <Button
        variant="default"
        className={cn("w-full bg-primary hover:bg-primary/90", className)}
        disabled
      >
        <Heart className="h-4 w-4 mr-2" />
        Нравится ({likes})
      </Button>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "w-10 h-10 rounded-full", 
          isLiked && "bg-primary/10 text-primary border-primary/50",
          className
        )}
        onClick={handleLike}
        disabled={isLiking}
        aria-label={`Нравится (${likes})`}
      >
        <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      className={cn(
        "w-full", 
        isLiked ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/50" : "bg-primary hover:bg-primary/90",
        className
      )}
      onClick={handleLike}
      disabled={isLiking}
    >
      <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-current")} />
      {isLiking ? "Обработка..." : `Нравится (${likes})`}
    </Button>
  );
}
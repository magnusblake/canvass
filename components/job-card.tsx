"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Award, 
  Calendar,
  ChevronRight,
  Star,
  Building2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  featured?: boolean
  className?: string
}

export default function JobCard({ job, featured = false, className }: JobCardProps) {
  const jobTypeIcons = {
    'full-time': <Briefcase className="h-4 w-4 text-blue-500" />,
    'part-time': <Clock className="h-4 w-4 text-green-500" />,
    'remote': <MapPin className="h-4 w-4 text-purple-500" />,
    'freelance': <Award className="h-4 w-4 text-orange-500" />
  }
  
  const jobTypeLabels = {
    'full-time': 'Полная занятость',
    'part-time': 'Частичная занятость',
    'remote': 'Удалённая работа',
    'freelance': 'Фриланс'
  }
  
  const experienceLabels = {
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior'
  }
  
  const experienceColors = {
    'junior': 'text-green-500',
    'middle': 'text-blue-500',
    'senior': 'text-purple-500'
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all border",
      featured ? "border-primary/50 bg-primary/5" : "",
      className
    )}>
      {featured && (
        <div className="bg-primary text-primary-foreground text-xs py-1 px-3 text-center">
          <Star className="h-3 w-3 inline-block mr-1" /> Рекомендуемая вакансия
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName || "Компания"}
                fill
                className="object-cover"
              />
            ) : (
              <Building2 className="h-full w-full p-2 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link href={`/jobs/${job.slug}`}>
              <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
            </Link>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Link href={`/companies/${job.companyId}`} className="hover:text-primary transition-colors mr-2">
                {job.companyName || "Компания"}
              </Link>
              •
              <span className="mx-2">{job.location}</span>
              •
              <span className="ml-2 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(job.createdAt), 'dd MMM yyyy', { locale: ru })}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                {jobTypeIcons[job.type]}
                {jobTypeLabels[job.type]}
              </Badge>
              
              <Badge variant="outline" className={cn("flex items-center gap-1", experienceColors[job.experience])}>
                <Award className="h-4 w-4" />
                {experienceLabels[job.experience]}
              </Badge>
              
              {job.salary && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {job.salary}
                </Badge>
              )}
              
              {job.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {job.category}
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {job.description}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/jobs/${job.slug}`}>
                  Подробнее
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href={`/jobs/${job.slug}#apply`}>
                  Откликнуться
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
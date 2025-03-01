import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  ChevronLeft,
  Globe,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  getJobBySlug, 
  getJobsByCategory, 
  getCompanyById, 
  getAllJobs 
} from "@/lib/data"
import Header from "@/components/header"
import JobApplicationForm from "@/components/job-application-form"
import JobCard from "@/components/job-card"
import ShareButton from "@/components/share-button"

interface JobDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const jobs = await getAllJobs();
    return jobs
      .filter(job => job.slug) // Make sure slug is defined
      .map(job => ({
        slug: job.slug
      }));
  } catch (error) {
    console.error('Error generating static params for jobs:', error);
    return []; // Return empty array to avoid generating pages on error
  }
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  try {
    const job = await getJobBySlug(params.slug);

    if (!job) {
      return {
        title: "Вакансия не найдена",
      }
    }

    return {
      title: `${job.title} | ${job.companyName} | Canvas Jobs`,
      description: job.description,
    }
  } catch (error) {
    console.error('Error generating metadata for job:', params.slug, error);
    return {
      title: "Ошибка загрузки вакансии",
    }
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  try {
    const job = await getJobBySlug(params.slug);

    if (!job) {
      notFound();
    }

    const company = await getCompanyById(job.companyId);
    const similarJobs = await getJobsByCategory(job.category);
    
    // Remove current job from similar jobs and limit to 3
    const filteredSimilarJobs = similarJobs
      .filter(similarJob => similarJob.id !== job.id)
      .slice(0, 3);

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

    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад к вакансиям
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                    {job.companyLogo ? (
                      <Image
                        src={job.companyLogo}
                        alt={company?.name || "Компания"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Building2 className="h-full w-full p-3 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{job.title}</h1>
                      {job.featured && (
                        <Badge className="bg-primary">Рекомендуемая</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Link href={`/companies/${job.companyId}`} className="hover:text-primary transition-colors">
                        {company?.name || job.companyName || "Компания"}
                      </Link>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {jobTypeLabels[job.type]}
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {experienceLabels[job.experience]}
                      </Badge>
                      
                      {job.salary && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          {job.salary}
                        </Badge>
                      )}
                      
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {job.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Описание вакансии</h2>
                    <div className="prose prose-sm max-w-none">
                      <p>{job.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Требования</h2>
                    <div className="prose prose-sm max-w-none">
                      <p>{job.requirements}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Обязанности</h2>
                    <div className="prose prose-sm max-w-none">
                      <p>{job.responsibilities}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div id="apply" className="pt-4">
                  <h2 className="text-xl font-semibold mb-6">Откликнуться на вакансию</h2>
                  <JobApplicationForm jobId={job.id} />
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Company Info */}
                <div className="bg-card rounded-lg border p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">О компании</h2>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      {job.companyLogo ? (
                        <Image
                          src={job.companyLogo}
                          alt={company?.name || "Компания"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Building2 className="h-full w-full p-2 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{company?.name || job.companyName}</h3>
                      {company?.verified && (
                        <div className="flex items-center text-xs text-primary">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Проверенная компания
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {company?.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                      {company.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {company?.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Опубликовано: {format(new Date(job.createdAt), 'dd MMMM yyyy', { locale: ru })}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/companies/${job.companyId}`}>
                        Профиль компании
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {/* Share Job */}
                <div className="bg-card rounded-lg border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Поделиться вакансией</h3>
                  <ShareButton 
                    title={`${job.title} в ${company?.name || job.companyName}`}
                    text={`Вакансия: ${job.title}`}
                    url={`/jobs/${job.slug}`}
                    variant="outline"
                    className="w-full"
                  />
                </div>
                
                {/* Job Details */}
                <div className="bg-card rounded-lg border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Детали вакансии</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Тип занятости</h4>
                        <p className="text-sm text-muted-foreground">{jobTypeLabels[job.type]}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Уровень</h4>
                        <p className="text-sm text-muted-foreground">{experienceLabels[job.experience]}</p>
                      </div>
                    </div>
                    
                    {job.salary && (
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 flex items-center justify-center">₽</div>
                        <div>
                          <h4 className="font-medium">Зарплата</h4>
                          <p className="text-sm text-muted-foreground">{job.salary}</p>
                        </div>
                      </div>
                    )}
                    
                    {job.expiresAt && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Дедлайн</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(job.expiresAt), 'dd MMMM yyyy', { locale: ru })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar Jobs */}
          {filteredSimilarJobs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Похожие вакансии</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredSimilarJobs.map((similarJob) => (
                  <JobCard key={similarJob.id} job={similarJob} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error rendering job detail page:', error);
    notFound();
  }
}
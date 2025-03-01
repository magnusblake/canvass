import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { 
  getJobById, 
  createJobApplication, 
  hasUserApplied,
  getCompanyById
} from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const job = await getJobById(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if job is still active
    if (!job.active) {
      return NextResponse.json({ error: "This job posting is no longer active" }, { status: 400 })
    }

    // Check if user has already applied
    const alreadyApplied = await hasUserApplied(session.user.id, params.id)
    if (alreadyApplied) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 })
    }

    // Check if user is the company owner (prevent applying to own job)
    const company = await getCompanyById(job.companyId)
    if (company && company.ownerId === session.user.id) {
      return NextResponse.json({ error: "You cannot apply to your own job posting" }, { status: 400 })
    }

    const { resumeUrl, coverLetter } = await req.json()

    const application = await createJobApplication({
      jobId: params.id,
      userId: session.user.id,
      resumeUrl,
      coverLetter
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error applying to job:", error)
    return NextResponse.json({ error: "Failed to apply to job" }, { status: 500 })
  }
}
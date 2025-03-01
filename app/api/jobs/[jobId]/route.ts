import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getJobById, updateJob, deleteJob, getCompanyById } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const job = await getJobById(params.jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const job = await getJobById(params.jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Verify job's company belongs to the user
    const company = await getCompanyById(job.companyId)
    if (!company || company.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const updatedJob = await updateJob(params.jobId, body)

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const job = await getJobById(params.jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Verify job's company belongs to the user
    const company = await getCompanyById(job.companyId)
    if (!company || company.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteJob(params.jobId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
import { getJobApplications } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const job = await getJobById(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Verify user owns the company that posted the job
    const company = await getCompanyById(job.companyId)
    if (!company || company.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const applications = await getJobApplications(params.id)

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching job applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
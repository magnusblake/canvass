import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getUserApplications } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const applications = await getUserApplications(session.user.id, params.jobId)
    
    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
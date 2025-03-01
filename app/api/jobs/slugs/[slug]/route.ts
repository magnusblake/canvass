import { NextResponse } from "next/server"
import { getJobBySlug } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    if (!params.slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }
    
    const job = await getJobBySlug(params.slug)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job by slug:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}
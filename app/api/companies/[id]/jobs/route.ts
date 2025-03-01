import { NextResponse } from "next/server"
import { getJobsByCompany, getCompanyById } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const includeInactive = searchParams.get("includeInactive") === "true"
    
    const company = await getCompanyById(params.id)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const jobs = await getJobsByCompany(params.id, !includeInactive)

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching company jobs:", error)
    return NextResponse.json({ error: "Failed to fetch company jobs" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { 
  getAllJobs, 
  getFeaturedJobs, 
  getJobsByCategory, 
  getJobsByType, 
  getJobsByExperience,
  createJob,
  getCompanyById
} from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured") === "true"
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const experience = searchParams.get("experience")
    
    let jobs;
    
    // Use appropriate data function based on query params
    if (featured) {
      jobs = await getFeaturedJobs()
    } else if (category) {
      jobs = await getJobsByCategory(category)
    } else if (type) {
      jobs = await getJobsByType(type)
    } else if (experience) {
      jobs = await getJobsByExperience(experience)
    } else {
      jobs = await getAllJobs()
    }
    
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { 
      title, 
      description, 
      requirements,
      responsibilities,
      location,
      type,
      salary,
      category,
      experience,
      tags,
      companyId
    } = body

    if (!title || !description || !requirements || !responsibilities || !location || !type || !category || !experience || !companyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify that the company exists and belongs to the user
    const company = await getCompanyById(companyId)
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }
    
    if (company.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized - You don't own this company" }, { status: 403 })
    }
    
    // Check if the company is verified
    if (!company.verified) {
      return NextResponse.json({ error: "Company not verified - Verification required to post jobs" }, { status: 403 })
    }

    const job = await createJob({
      title,
      description,
      requirements,
      responsibilities,
      location,
      type,
      salary,
      category,
      experience,
      tags: tags || [],
      companyId,
      featured: body.featured || false,
      active: body.active !== undefined ? body.active : true,
      expiresAt: body.expiresAt || null
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAllCompanies, createCompany, getCompanyByInn } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const verifiedOnly = searchParams.get("verified") === "true"
    
    const companies = await getAllCompanies(verifiedOnly)
    
    return NextResponse.json(companies)
  } catch (error) {
    console.error("Error fetching companies:", error)
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, logo, website, inn } = body

    if (!name || !inn) {
      return NextResponse.json({ error: "Name and INN are required" }, { status: 400 })
    }

    // Check if INN is already registered
    const existingCompany = await getCompanyByInn(inn)
    if (existingCompany) {
      return NextResponse.json({ error: "Company with this INN already exists" }, { status: 400 })
    }

    // Validate Russian INN format (10 or 12 digits)
    const innRegex = /^(\d{10}|\d{12})$/
    if (!innRegex.test(inn)) {
      return NextResponse.json({ error: "Invalid INN format" }, { status: 400 })
    }

    const company = await createCompany({
      name,
      description,
      logo,
      website,
      inn,
      ownerId: session.user.id
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error creating company:", error)
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
  }
}
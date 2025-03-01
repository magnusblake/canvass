import { getCompaniesByOwnerId } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const companies = await getCompaniesByOwnerId(session.user.id)
    
    return NextResponse.json(companies)
  } catch (error) {
    console.error("Error fetching user companies:", error)
    return NextResponse.json({ error: "Failed to fetch user companies" }, { status: 500 })
  }
}
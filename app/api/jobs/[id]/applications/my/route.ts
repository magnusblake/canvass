import { getUserApplications } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const applications = await getUserApplications(session.user.id)
    
    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
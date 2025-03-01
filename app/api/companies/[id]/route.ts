import { getCompanyById, updateCompany, deleteCompany } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const company = await getCompanyById(params.id)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const company = await getCompanyById(params.id)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // Only owner or admin can update company
    const isAdmin = session.user.id === 'user1' || session.user.id === 'user3'; // Temporary admin check
    if (company.ownerId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    // Only admin can verify company
    if (body.verified !== undefined && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Only admins can verify companies" }, { status: 403 })
    }

    const updatedCompany = await updateCompany(params.id, body)

    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error("Error updating company:", error)
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const company = await getCompanyById(params.id)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // Only owner or admin can delete company
    const isAdmin = session.user.id === 'user1' || session.user.id === 'user3'; // Temporary admin check
    if (company.ownerId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteCompany(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting company:", error)
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCompanyById, updateCompany } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession()
  
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    // Only admin can verify companies
    const isAdmin = session.user.id === 'user1' || session.user.id === 'user3'; // Temporary admin check
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }
  
    try {
      const company = await getCompanyById(params.id)
  
      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 })
      }
  
      const updatedCompany = await updateCompany(params.id, { verified: true })
  
      return NextResponse.json(updatedCompany)
    } catch (error) {
      console.error("Error verifying company:", error)
      return NextResponse.json({ error: "Failed to verify company" }, { status: 500 })
    }
  }
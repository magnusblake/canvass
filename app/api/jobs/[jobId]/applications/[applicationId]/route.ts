import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { 
    getJobApplicationById,
    updateJobApplication,
    deleteJobApplication,
    getJobById,
    getCompanyById
  } from "@/lib/data"
  
  export const dynamic = 'force-dynamic';
  
  export async function GET(req: Request, { params }: { params: { jobId: string, applicationId: string } }) {
    const session = await getSession()
  
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    try {
      const application = await getJobApplicationById(params.applicationId)
  
      if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }
  
      // Check if user is the applicant or the job owner
      const job = await getJobById(application.jobId)
      const company = job ? await getCompanyById(job.companyId) : null
      
      if (application.userId !== session.user.id && (!company || company.ownerId !== session.user.id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      return NextResponse.json(application)
    } catch (error) {
      console.error("Error fetching application:", error)
      return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
    }
  }
  
  export async function PATCH(req: Request, { params }: { params: { jobId: string, applicationId: string } }) {
    const session = await getSession()
  
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    try {
      const application = await getJobApplicationById(params.applicationId)
  
      if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }
  
      const job = await getJobById(application.jobId)
      if (!job) {
        return NextResponse.json({ error: "Associated job not found" }, { status: 404 })
      }
  
      const company = await getCompanyById(job.companyId)
      const isCompanyOwner = company && company.ownerId === session.user.id
      const isApplicant = application.userId === session.user.id
  
      // Only company owner can update status
      // Only applicant can update resume/cover letter
      const body = await req.json()
      
      if (body.status !== undefined && !isCompanyOwner) {
        return NextResponse.json({ 
          error: "Unauthorized - Only the company owner can update application status" 
        }, { status: 403 })
      }
  
      if ((body.resumeUrl !== undefined || body.coverLetter !== undefined) && !isApplicant) {
        return NextResponse.json({ 
          error: "Unauthorized - Only the applicant can update resume and cover letter" 
        }, { status: 403 })
      }
  
      if (!isCompanyOwner && !isApplicant) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const updatedApplication = await updateJobApplication(params.applicationId, body)
  
      return NextResponse.json(updatedApplication)
    } catch (error) {
      console.error("Error updating application:", error)
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { jobId: string, applicationId: string } }) {
    const session = await getSession()
  
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    try {
      const application = await getJobApplicationById(params.applicationId)
  
      if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }
  
      // Only the applicant can withdraw their application
      if (application.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      await deleteJobApplication(params.applicationId)
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error deleting application:", error)
      return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
    }
  }
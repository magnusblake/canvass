import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getBlogPostById, getBlogComments, createBlogComment } from "@/lib/data"
import db from "@/lib/db"

export const dynamic = 'force-dynamic';

// Helper functions with transaction handling
async function getPostWithLock(id: string) {
  return db.transaction(() => {
    return db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
  }).immediate();
}

async function getCommentsTransaction(postId: string) {
  return db.transaction(() => {
    return db.prepare(`
      SELECT bc.*, u.name as userName, u.image as userImage 
      FROM blog_comments bc
      JOIN users u ON bc.userId = u.id
      WHERE postId = ?
      ORDER BY createdAt DESC
    `).all(postId);
  }).immediate();
}

async function createCommentTransaction(comment: {
  content: string;
  postId: string;
  userId: string;
}) {
  return db.transaction(() => {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO blog_comments (id, content, postId, userId, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      comment.content,
      comment.postId,
      comment.userId,
      new Date().toISOString()
    );
    
    return db.prepare(`
      SELECT bc.*, u.name as userName, u.image as userImage 
      FROM blog_comments bc
      JOIN users u ON bc.userId = u.id
      WHERE bc.rowid = ?
    `).get(lastInsertRowid);
  }).exclusive();
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getPostWithLock(params.id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const comments = await getCommentsTransaction(params.id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching blog comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await getPostWithLock(params.id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const { content } = await req.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" }, 
        { status: 400 }
      );
    }

    const newComment = await createCommentTransaction({
      content: content.trim(),
      postId: params.id,
      userId: session.user.id
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" }, 
      { status: 500 }
    );
  }
}
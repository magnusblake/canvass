import { v4 as uuidv4 } from 'uuid';
import db from './db';
import type { Project, Story } from "./types";

// Преобразовать строки из БД в объект проекта
function projectFromDb(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    featured: Boolean(row.featured),
    category: row.category,
    tags: JSON.parse(row.tags),
    views: row.views,
    likes: row.likeCount || 0,
    author: row.authorName,
    authorId: row.authorId,
    createdAt: row.createdAt
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const stmt = db.prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    GROUP BY p.id
    ORDER BY p.createdAt DESC
  `);

  const rows = stmt.all();
  return rows.map(projectFromDb);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const stmt = db.prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    WHERE p.id = ?
    GROUP BY p.id
  `);

  const row = stmt.get(id);
  if (!row) return null;

  // Обновляем счетчик просмотров
  const updateViewsStmt = db.prepare('UPDATE projects SET views = views + 1 WHERE id = ?');
  updateViewsStmt.run(id);

  return projectFromDb(row);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const stmt = db.prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    WHERE p.featured = 1
    GROUP BY p.id
    ORDER BY p.createdAt DESC
  `);

  const rows = stmt.all();
  return rows.map(projectFromDb);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const stmt = db.prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    WHERE p.category = ?
    GROUP BY p.id
    ORDER BY p.createdAt DESC
  `);

  const rows = stmt.all(category);
  return rows.map(projectFromDb);
}

export async function getAllStories(): Promise<Story[]> {
  const stmt = db.prepare('SELECT * FROM stories ORDER BY createdAt DESC');
  return stmt.all() as Story[];
}

export async function createProject(data: {
  title: string;
  description: string;
  image: string;
  category: "2d" | "3d";
  tags: string[];
  authorId: string;
  featured?: boolean;
}): Promise<Project> {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO projects (id, title, description, image, featured, category, tags, createdAt, updatedAt, authorId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    data.title,
    data.description,
    data.image,
    data.featured ? 1 : 0,
    data.category,
    JSON.stringify(data.tags),
    now,
    now,
    data.authorId
  );
  
  return getProjectById(id) as Promise<Project>;
}

export async function updateProject(id: string, data: {
  title?: string;
  description?: string;
  image?: string;
  category?: "2d" | "3d";
  tags?: string[];
  featured?: boolean;
}): Promise<Project | null> {
  const project = await getProjectById(id);
  if (!project) return null;
  
  const updateFields = [];
  const params = [];
  
  if (data.title !== undefined) {
    updateFields.push('title = ?');
    params.push(data.title);
  }
  
  if (data.description !== undefined) {
    updateFields.push('description = ?');
    params.push(data.description);
  }
  
  if (data.image !== undefined) {
    updateFields.push('image = ?');
    params.push(data.image);
  }
  
  if (data.category !== undefined) {
    updateFields.push('category = ?');
    params.push(data.category);
  }
  
  if (data.tags !== undefined) {
    updateFields.push('tags = ?');
    params.push(JSON.stringify(data.tags));
  }
  
  if (data.featured !== undefined) {
    updateFields.push('featured = ?');
    params.push(data.featured ? 1 : 0);
  }
  
  updateFields.push('updatedAt = ?');
  params.push(new Date().toISOString());
  
  // Добавляем id проекта в параметры
  params.push(id);
  
  if (updateFields.length > 0) {
    const stmt = db.prepare(`
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...params);
  }
  
  return getProjectById(id);
}

export async function getSimilarProjects(projectId: string, limit: number = 4): Promise<Project[]> {
  // Получаем текущий проект
  const project = await getProjectById(projectId);
  
  if (!project) {
    return [];
  }
  
  // Поиск проектов с похожими тегами или в той же категории
  const stmt = db.prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    WHERE p.id != ? AND (p.category = ? OR p.tags LIKE ?)
    GROUP BY p.id
    ORDER BY RANDOM()
    LIMIT ?
  `);
  
  const rows = stmt.all(
    projectId,
    project.category,
    `%${project.tags[0] || ''}%`,
    limit
  );
  
  return rows.map(projectFromDb);
}

export async function deleteProject(id: string): Promise<boolean> {
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export async function getUserById(id: string) {
  const userStmt = db.prepare(`
    SELECT u.*, 
           u.vk_link as vkLink, 
           u.behance_link as behanceLink,
           u.telegram_link as telegramLink
    FROM users u 
    WHERE u.id = ?`);
  const user = userStmt.get(id);
  
  if (!user) return null;
  
  // Получаем проекты пользователя
  const projectsStmt = db.prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    WHERE p.authorId = ?
    GROUP BY p.id
    ORDER BY p.createdAt DESC
  `);
  
  const projectRows = projectsStmt.all(id);
  const projects = projectRows.map(projectFromDb);
  
  // Получаем подписчиков
  const followersStmt = db.prepare(`
    SELECT u.* FROM users u
    INNER JOIN followers f ON u.id = f.followerId
    WHERE f.followingId = ?
  `);
  const followers = followersStmt.all(id);
  
  // Получаем подписки
  const followingStmt = db.prepare(`
    SELECT u.* FROM users u
    INNER JOIN followers f ON u.id = f.followingId
    WHERE f.followerId = ?
  `);
  const following = followingStmt.all(id);
  
  // Получаем награды
  const awardsStmt = db.prepare(`SELECT * FROM awards WHERE userId = ? ORDER BY date DESC`);
  const awards = awardsStmt.all(id);
  
  // Преобразуем interests из JSON строки в массив
  let interests = [];
  if (user.interests) {
    try {
      interests = JSON.parse(user.interests);
    } catch (e) {
      interests = [];
    }
  }
  
  return {
    ...user,
    interests,
    projects,
    followers,
    following,
    awards
  };
}

export async function getUserByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  image?: string;
}): Promise<any> {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, password, image)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    data.name,
    data.email,
    data.password || null,
    data.image || null
  );
  
  return getUserById(id);
}

export async function toggleLike(userId: string, projectId: string): Promise<{ liked: boolean }> {
  // Проверяем, существует ли лайк
  const checkStmt = db.prepare('SELECT id FROM likes WHERE userId = ? AND projectId = ?');
  const existingLike = checkStmt.get(userId, projectId);
  
  if (existingLike) {
    // Удаляем лайк
    const deleteStmt = db.prepare('DELETE FROM likes WHERE id = ?');
    deleteStmt.run(existingLike.id);
    return { liked: false };
  } else {
    // Добавляем лайк
    const id = uuidv4();
    const insertStmt = db.prepare('INSERT INTO likes (id, userId, projectId) VALUES (?, ?, ?)');
    insertStmt.run(id, userId, projectId);
    return { liked: true };
  }
}

export async function isProjectLikedByUser(userId: string, projectId: string): Promise<boolean> {
  const stmt = db.prepare('SELECT id FROM likes WHERE userId = ? AND projectId = ?');
  const like = stmt.get(userId, projectId);
  return !!like;
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  bio?: string;
  image?: string;
  banner?: string;
  country?: string;
  interests?: string[];
  vkLink?: string;
  behanceLink?: string;
  telegramLink?: string;
}): Promise<User | null> {
  const user = await getUserById(userId);
  if (!user) return null;
  
  const updateFields = [];
  const params = [];
  
  if (data.name !== undefined) {
    updateFields.push('name = ?');
    params.push(data.name);
  }
  
  if (data.bio !== undefined) {
    updateFields.push('bio = ?');
    params.push(data.bio);
  }
  
  if (data.image !== undefined) {
    updateFields.push('image = ?');
    params.push(data.image);
  }
  
  if (data.banner !== undefined) {
    updateFields.push('banner = ?');
    params.push(data.banner);
  }
  
  if (data.country !== undefined) {
    updateFields.push('country = ?');
    params.push(data.country);
  }
  
  if (data.interests !== undefined) {
    updateFields.push('interests = ?');
    params.push(JSON.stringify(data.interests));
  }
  
  if (data.vkLink !== undefined) {
    updateFields.push('vk_link = ?');
    params.push(data.vkLink);
  }
  
  if (data.behanceLink !== undefined) {
    updateFields.push('behance_link = ?');
    params.push(data.behanceLink);
  }
  
  if (data.telegramLink !== undefined) {
    updateFields.push('telegram_link = ?');
    params.push(data.telegramLink);
  }
  
  // Добавляем id пользователя в параметры
  params.push(userId);
  
  if (updateFields.length > 0) {
    const stmt = db.prepare(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...params);
  }
  
  return getUserById(userId);
}

export async function togglePremium(userId: string): Promise<{ premium: boolean }> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  
  const newPremiumStatus = user.premium ? 0 : 1;
  const stmt = db.prepare('UPDATE users SET premium = ? WHERE id = ?');
  stmt.run(newPremiumStatus, userId);
  
  return { premium: Boolean(newPremiumStatus) };
}

export async function followUser(followerId: string, followingId: string): Promise<{ followed: boolean }> {
  // Проверяем, существует ли уже подписка
  const checkStmt = db.prepare('SELECT id FROM followers WHERE followerId = ? AND followingId = ?');
  const existingFollow = checkStmt.get(followerId, followingId);
  
  if (existingFollow) {
    // Отписываемся
    const deleteStmt = db.prepare('DELETE FROM followers WHERE id = ?');
    deleteStmt.run(existingFollow.id);
    return { followed: false };
  } else {
    // Подписываемся
    const id = uuidv4();
    const insertStmt = db.prepare('INSERT INTO followers (id, followerId, followingId) VALUES (?, ?, ?)');
    insertStmt.run(id, followerId, followingId);
    return { followed: true };
  }
}

export async function getFollowings(userId: string): Promise<User[]> {
  const stmt = db.prepare(`
    SELECT u.* FROM users u
    INNER JOIN followers f ON u.id = f.followingId
    WHERE f.followerId = ?
  `);
  
  return stmt.all(userId);
}

export async function getFollowers(userId: string): Promise<User[]> {
  const stmt = db.prepare(`
    SELECT u.* FROM users u
    INNER JOIN followers f ON u.id = f.followerId
    WHERE f.followingId = ?
  `);
  
  return stmt.all(userId);
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const stmt = db.prepare('SELECT id FROM followers WHERE followerId = ? AND followingId = ?');
  const follow = stmt.get(followerId, followingId);
  return !!follow;
}

export async function addAward(data: {
  userId: string;
  title: string;
  description: string;
  image: string;
}): Promise<Award> {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO awards (id, userId, title, description, image)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(id, data.userId, data.title, data.description, data.image);
  
  return getAwardById(id);
}

export async function getAwardById(id: string): Promise<Award> {
  const stmt = db.prepare('SELECT * FROM awards WHERE id = ?');
  return stmt.get(id);
}

export async function getUserAwards(userId: string): Promise<Award[]> {
  const stmt = db.prepare('SELECT * FROM awards WHERE userId = ? ORDER BY date DESC');
  return stmt.all(userId);
}
function blogPostFromDb(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    author: row.authorName,
    authorId: row.authorId,
    authorImage: row.authorImage,
    category: row.category,
    tags: JSON.parse(row.tags),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export async function getAllBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  const query = `
    SELECT b.*, u.name as authorName, u.image as authorImage
    FROM blog_posts b
    LEFT JOIN users u ON b.authorId = u.id
    ${includeUnpublished ? '' : 'WHERE b.published = 1'}
    ORDER BY b.createdAt DESC
  `;
  
  const stmt = db.prepare(query);
  const rows = stmt.all();
  return rows.map(blogPostFromDb);
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const stmt = db.prepare(`
    SELECT b.*, u.name as authorName, u.image as authorImage
    FROM blog_posts b
    LEFT JOIN users u ON b.authorId = u.id
    WHERE b.featured = 1 AND b.published = 1
    ORDER BY b.createdAt DESC
  `);
  
  const rows = stmt.all();
  return rows.map(blogPostFromDb);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const stmt = db.prepare(`
    SELECT b.*, u.name as authorName, u.image as authorImage
    FROM blog_posts b
    LEFT JOIN users u ON b.authorId = u.id
    WHERE b.id = ?
  `);
  
  const row = stmt.get(id);
  if (!row) return null;
  
  return blogPostFromDb(row);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const stmt = db.prepare(`
    SELECT b.*, u.name as authorName, u.image as authorImage
    FROM blog_posts b
    LEFT JOIN users u ON b.authorId = u.id
    WHERE b.slug = ?
  `);
  
  const row = stmt.get(slug);
  if (!row) return null;
  
  return blogPostFromDb(row);
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const stmt = db.prepare(`
    SELECT b.*, u.name as authorName, u.image as authorImage
    FROM blog_posts b
    LEFT JOIN users u ON b.authorId = u.id
    WHERE b.category = ? AND b.published = 1
    ORDER BY b.createdAt DESC
  `);
  
  const rows = stmt.all(category);
  return rows.map(blogPostFromDb);
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const stmt = db.prepare(`
    SELECT b.*, u.name as authorName, u.image as authorImage
    FROM blog_posts b
    LEFT JOIN users u ON b.authorId = u.id
    WHERE b.tags LIKE ? AND b.published = 1
    ORDER BY b.createdAt DESC
  `);
  
  // Search for tag in JSON array
  const rows = stmt.all(`%${tag}%`);
  return rows.map(row => {
    const post = blogPostFromDb(row);
    // Filter out posts where tag isn't actually in the tags array
    if (post.tags.includes(tag)) {
      return post;
    }
    return null;
  }).filter(Boolean) as BlogPost[];
}

export async function createBlogPost(data: {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  featured?: boolean;
  published?: boolean;
}): Promise<BlogPost> {
  const id = uuidv4();
  const slug = slugify(data.title) + '-' + id.slice(0, 8);
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO blog_posts (
      id, title, slug, content, excerpt, coverImage, 
      category, tags, authorId, featured, published, 
      createdAt, updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    data.title,
    slug,
    data.content,
    data.excerpt,
    data.coverImage,
    data.category,
    JSON.stringify(data.tags),
    data.authorId,
    data.featured ? 1 : 0,
    data.published !== undefined ? (data.published ? 1 : 0) : 1,
    now,
    now
  );
  
  return getBlogPostById(id) as Promise<BlogPost>;
}

// Helper function to create URL-friendly slugs
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export async function updateBlogPost(id: string, data: {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}): Promise<BlogPost | null> {
  const post = await getBlogPostById(id);
  if (!post) return null;
  
  const updateFields = [];
  const params = [];
  
  if (data.title !== undefined) {
    updateFields.push('title = ?');
    params.push(data.title);
    
    // Update slug if title changes
    updateFields.push('slug = ?');
    params.push(slugify(data.title) + '-' + id.slice(0, 8));
  }
  
  if (data.content !== undefined) {
    updateFields.push('content = ?');
    params.push(data.content);
  }
  
  if (data.excerpt !== undefined) {
    updateFields.push('excerpt = ?');
    params.push(data.excerpt);
  }
  
  if (data.coverImage !== undefined) {
    updateFields.push('coverImage = ?');
    params.push(data.coverImage);
  }
  
  if (data.category !== undefined) {
    updateFields.push('category = ?');
    params.push(data.category);
  }
  
  if (data.tags !== undefined) {
    updateFields.push('tags = ?');
    params.push(JSON.stringify(data.tags));
  }
  
  if (data.featured !== undefined) {
    updateFields.push('featured = ?');
    params.push(data.featured ? 1 : 0);
  }
  
  if (data.published !== undefined) {
    updateFields.push('published = ?');
    params.push(data.published ? 1 : 0);
  }
  
  updateFields.push('updatedAt = ?');
  params.push(new Date().toISOString());
  
  // Add post ID to params
  params.push(id);
  
  if (updateFields.length > 0) {
    const stmt = db.prepare(`
      UPDATE blog_posts 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...params);
  }
  
  return getBlogPostById(id);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const stmt = db.prepare('DELETE FROM blog_posts WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// Blog comments
export async function getBlogComments(postId: string) {
  const stmt = db.prepare(`
    SELECT c.*, u.name as userName, u.image as userImage, u.premium as userPremium
    FROM blog_comments c
    JOIN users u ON c.userId = u.id
    WHERE c.postId = ?
    ORDER BY c.createdAt DESC
  `);
  
  return stmt.all(postId);
}

export async function createBlogComment(data: {
  content: string;
  postId: string;
  userId: string;
}): Promise<any> {
  const id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO blog_comments (id, content, postId, userId)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(id, data.content, data.postId, data.userId);
  
  // Get the created comment with user info
  const commentStmt = db.prepare(`
    SELECT c.*, u.name as userName, u.image as userImage, u.premium as userPremium
    FROM blog_comments c
    JOIN users u ON c.userId = u.id
    WHERE c.id = ?
  `);
  
  return commentStmt.get(id);
}

export interface Company {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  inn: string;
  verified: boolean;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  type: 'full-time' | 'part-time' | 'remote' | 'freelance';
  salary: string | null;
  category: string;
  experience: 'junior' | 'middle' | 'senior';
  tags: string[];
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
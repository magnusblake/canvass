import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Убедимся, что директория для базы данных существует
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'canvas.db');

// Инициализация базы данных
const db = new BetterSqlite3(dbPath);

// Включаем внешние ключи для поддержки связей
db.pragma('foreign_keys = ON');

// SQL для создания таблиц
const createTables = `
-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  image TEXT,
  bio TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Проекты
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('2d', '3d')),
  tags TEXT NOT NULL, -- JSON array as text
  views INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  authorId TEXT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Лайки
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  projectId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE(userId, projectId)
);

-- Истории
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  link TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// Выполняем скрипт создания таблиц
db.exec(createTables);

// Функция для проверки, пустая ли база данных
export function isDatabaseEmpty() {
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const storyCount = db.prepare('SELECT COUNT(*) as count FROM stories').get();
  
  return projectCount.count === 0 && userCount.count === 0 && storyCount.count === 0;
}

// Функция для наполнения базы данных демо-данными
export function seedDatabase() {
  if (!isDatabaseEmpty()) {
    return; // Не заполняем, если база данных уже содержит данные
  }
  
  // Очищаем таблицы перед вставкой демо-данных
  db.prepare('DELETE FROM likes').run();
  db.prepare('DELETE FROM projects').run();
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM stories').run();
  
  // Вставляем демо пользователей
  const insertUser = db.prepare(
    'INSERT INTO users (id, name, email, image, bio) VALUES (?, ?, ?, ?, ?)'
  );
  
  const users = [
    { id: 'user1', name: 'Анна Смирнова', email: 'anna@example.com', image: null, bio: 'Дизайнер интерфейсов с 5-летним опытом работы' },
    { id: 'user2', name: 'Максим Петров', email: 'maxim@example.com', image: null, bio: '3D-визуализатор интерьеров и архитектурных объектов' },
    { id: 'user3', name: 'Елена Козлова', email: 'elena@example.com', image: null, bio: 'Графический дизайнер, специализируюсь на брендинге' },
    { id: 'user4', name: 'Игорь Волков', email: 'igor@example.com', image: null, bio: '3D-художник и концепт-дизайнер игровых персонажей' },
    { id: 'user5', name: 'Марина Соколова', email: 'marina@example.com', image: null, bio: 'UI/UX дизайнер мобильных приложений' }
  ];
  
  for (const user of users) {
    insertUser.run(user.id, user.name, user.email, user.image, user.bio);
  }
  
  // Вставляем демо проекты
  const insertProject = db.prepare(
    'INSERT INTO projects (id, title, description, image, featured, category, tags, views, createdAt, authorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  const projects = [
    {
      id: '1',
      title: 'Минималистичный интерфейс приложения',
      description: 'Современный и чистый дизайн мобильного приложения с фокусом на удобство использования.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop',
      featured: 1,
      category: '2d',
      tags: JSON.stringify(['2d', 'uxui', 'web']),
      views: 1205,
      createdAt: '2023-12-15T10:30:00Z',
      authorId: 'user1'
    },
    {
      id: '2',
      title: '3D визуализация интерьера',
      description: 'Фотореалистичная 3D визуализация современного интерьера гостиной.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
      featured: 1,
      category: '3d',
      tags: JSON.stringify(['3d', 'interior', 'visualization']),
      views: 1050,
      createdAt: '2023-12-20T14:45:00Z',
      authorId: 'user2'
    },
    // Добавьте остальные проекты
    {
      id: '3',
      title: 'Брендинг для эко-стартапа',
      description: 'Разработка логотипа и фирменного стиля для экологического стартапа.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      featured: 0,
      category: '2d',
      tags: JSON.stringify(['2d', 'branding', 'logo']),
      views: 820,
      createdAt: '2023-12-25T09:15:00Z',
      authorId: 'user3'
    },
    {
      id: '4',
      title: 'Концепт игрового персонажа',
      description: '3D-модель персонажа для фэнтезийной игры.',
      image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=800&auto=format&fit=crop',
      featured: 1,
      category: '3d',
      tags: JSON.stringify(['3d', 'game', 'character']),
      views: 1560,
      createdAt: '2024-01-05T13:20:00Z',
      authorId: 'user4'
    },
    {
      id: '5',
      title: 'Дизайн мобильного приложения',
      description: 'UI/UX дизайн для приложения доставки еды.',
      image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop',
      featured: 0,
      category: '2d',
      tags: JSON.stringify(['2d', 'mobile', 'ui']),
      views: 876,
      createdAt: '2024-01-12T08:15:00Z',
      authorId: 'user5'
    }
  ];
  
  for (const project of projects) {
    insertProject.run(
      project.id,
      project.title,
      project.description,
      project.image,
      project.featured,
      project.category,
      project.tags,
      project.views,
      project.createdAt,
      project.authorId
    );
  }
  
  // Вставляем демо лайки
  const insertLike = db.prepare(
    'INSERT INTO likes (id, userId, projectId) VALUES (?, ?, ?)'
  );
  
  const likes = [
    { id: 'like1', userId: 'user1', projectId: '2' },
    { id: 'like2', userId: 'user1', projectId: '3' },
    { id: 'like3', userId: 'user2', projectId: '1' },
    { id: 'like4', userId: 'user3', projectId: '1' },
    { id: 'like5', userId: 'user3', projectId: '4' },
    { id: 'like6', userId: 'user4', projectId: '2' },
    { id: 'like7', userId: 'user5', projectId: '1' },
    { id: 'like8', userId: 'user5', projectId: '3' }
  ];
  
  for (const like of likes) {
    insertLike.run(like.id, like.userId, like.projectId);
  }
  
  // Вставляем демо истории
  const insertStory = db.prepare(
    'INSERT INTO stories (id, title, content, imageUrl, link, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  );
  
  const stories = [
    {
      id: '1',
      title: 'Новый конкурс!',
      content: 'Участвуйте в нашем новом конкурсе и выигрывайте ценные призы от спонсоров.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop',
      link: '/contests/new',
      createdAt: '2024-02-28T10:00:00Z'
    },
    {
      id: '2',
      title: 'Обновление платформы',
      content: 'Мы добавили новые функции для улучшения вашего опыта. Узнайте о них первыми!',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
      link: '/blog/platform-update',
      createdAt: '2024-02-27T15:30:00Z'
    },
    {
      id: '3',
      title: 'Мастер-класс',
      content: 'Не пропустите онлайн мастер-класс по 3D моделированию завтра в 19:00.',
      imageUrl: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=800&auto=format&fit=crop',
      link: '/events/3d-modeling-masterclass',
      createdAt: '2024-02-26T12:45:00Z'
    }
  ];
  
  for (const story of stories) {
    insertStory.run(
      story.id,
      story.title,
      story.content,
      story.imageUrl,
      story.link,
      story.createdAt
    );
  }
}

// Вызываем функцию заполнения базы данных
seedDatabase();

export default db;
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
  banner TEXT,
  bio TEXT,
  country TEXT,
  interests TEXT,
  premium INTEGER NOT NULL DEFAULT 0,
  vk_link TEXT,
  behance_link TEXT,
  telegram_link TEXT,
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

-- Подписки
CREATE TABLE IF NOT EXISTS followers (
  id TEXT PRIMARY KEY,
  followerId TEXT NOT NULL,
  followingId TEXT NOT NULL, 
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followingId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(followerId, followingId)
);

-- Награды
CREATE TABLE IF NOT EXISTS awards (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
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

-- Комментарии
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  projectId TEXT NOT NULL,
  userId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Сохраненные проекты
CREATE TABLE IF NOT EXISTS saved_projects (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  projectId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE(userId, projectId)
);

-- Посты блога
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  coverImage TEXT NOT NULL,
  authorId TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL, -- JSON array as text
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Комментарии блога
CREATE TABLE IF NOT EXISTS blog_comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  postId TEXT NOT NULL,
  userId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (postId) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Компании
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  website TEXT,
  inn TEXT UNIQUE,
  verified INTEGER NOT NULL DEFAULT 0,
  ownerId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
);

-- Вакансии
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- full-time, part-time, remote, freelance
  salary TEXT,
  category TEXT NOT NULL,
  experience TEXT NOT NULL, -- junior, middle, senior
  tags TEXT NOT NULL, -- JSON array as text
  companyId TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  expiresAt TEXT,
  FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
);

-- Отклик
CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  jobId TEXT NOT NULL,
  userId TEXT NOT NULL,
  resumeUrl TEXT,
  coverLetter TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewing, accepted, rejected
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(jobId, userId)
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

export function seedDatabase() {
  if (!isDatabaseEmpty()) {
    return; // Не заполняем, если база данных уже содержит данные
  }
  
  // Очищаем таблицы перед вставкой демо-данных
  db.prepare('DELETE FROM awards').run();
  db.prepare('DELETE FROM followers').run();
  db.prepare('DELETE FROM likes').run();
  db.prepare('DELETE FROM projects').run();
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM stories').run();
  
  // Вставляем демо пользователей
  const insertUser = db.prepare(
    'INSERT INTO users (id, name, email, image, bio, country, interests, premium, vk_link, behance_link, telegram_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  const users = [
    { 
      id: 'user1', 
      name: 'Анна Смирнова', 
      email: 'anna@example.com', 
      image: null, 
      bio: 'Дизайнер интерфейсов с 5-летним опытом работы', 
      country: 'Россия',
      interests: JSON.stringify(['UI/UX', 'мобильные интерфейсы', 'веб-дизайн']),
      premium: 1,
      vkLink: 'https://vk.com/anna_design',
      behanceLink: 'https://behance.net/annasmirn',
      telegramLink: 'https://t.me/anna_design'
    },
    { 
      id: 'user2', 
      name: 'Максим Петров', 
      email: 'maxim@example.com', 
      image: null, 
      bio: '3D-визуализатор интерьеров и архитектурных объектов', 
      country: 'Россия',
      interests: JSON.stringify(['3D-визуализация', 'архитектура', 'интерьеры']),
      premium: 0,
      vkLink: null,
      behanceLink: 'https://behance.net/maxpetr',
      telegramLink: null
    },
    { 
      id: 'user3', 
      name: 'Елена Козлова', 
      email: 'elena@example.com', 
      image: null, 
      bio: 'Графический дизайнер, специализируюсь на брендинге', 
      country: 'Беларусь',
      interests: JSON.stringify(['брендинг', 'логотипы', 'фирменный стиль']),
      premium: 1,
      vkLink: 'https://vk.com/elena_design',
      behanceLink: 'https://behance.net/elena_k',
      telegramLink: 'https://t.me/elena_design'
    },
    { 
      id: 'user4', 
      name: 'Игорь Волков', 
      email: 'igor@example.com', 
      image: null, 
      bio: '3D-художник и концепт-дизайнер игровых персонажей', 
      country: 'Украина',
      interests: JSON.stringify(['3D-моделирование', 'игровой дизайн', 'концепт-арт']),
      premium: 0,
      vkLink: null,
      behanceLink: 'https://behance.net/igor_volkov',
      telegramLink: 'https://t.me/igor_3d'
    },
    { 
      id: 'user5', 
      name: 'Марина Соколова', 
      email: 'marina@example.com', 
      image: null, 
      bio: 'UI/UX дизайнер мобильных приложений', 
      country: 'Россия',
      interests: JSON.stringify(['мобильный дизайн', 'UI/UX', 'прототипирование']),
      premium: 1,
      vkLink: 'https://vk.com/marina_design',
      behanceLink: 'https://behance.net/marina_s',
      telegramLink: 'https://t.me/marina_ux'
    }
  ];
  
  for (const user of users) {
    insertUser.run(
      user.id, 
      user.name, 
      user.email, 
      user.image, 
      user.bio, 
      user.country,
      user.interests,
      user.premium,
      user.vkLink,
      user.behanceLink,
      user.telegramLink
    );
  }
  
  // Вставляем демо подписки
  const insertFollower = db.prepare(
    'INSERT INTO followers (id, followerId, followingId) VALUES (?, ?, ?)'
  );
  
  const followers = [
    { id: 'follow1', followerId: 'user1', followingId: 'user2' },
    { id: 'follow2', followerId: 'user1', followingId: 'user3' },
    { id: 'follow3', followerId: 'user2', followingId: 'user1' },
    { id: 'follow4', followerId: 'user3', followingId: 'user1' },
    { id: 'follow5', followerId: 'user3', followingId: 'user4' },
    { id: 'follow6', followerId: 'user4', followingId: 'user2' },
    { id: 'follow7', followerId: 'user5', followingId: 'user1' },
    { id: 'follow8', followerId: 'user5', followingId: 'user3' }
  ];
  
  for (const follow of followers) {
    insertFollower.run(follow.id, follow.followerId, follow.followingId);
  }
  
  // Вставляем демо награды
  const insertAward = db.prepare(
    'INSERT INTO awards (id, userId, title, description, image, date) VALUES (?, ?, ?, ?, ?, ?)'
  );
  
  const awards = [
    { 
      id: 'award1', 
      userId: 'user1', 
      title: 'Дизайнер года', 
      description: 'Победитель ежегодного конкурса Canvas Awards в категории UI/UX', 
      image: '/awards/design-award.png',
      date: '2023-12-15T10:30:00Z'
    },
    { 
      id: 'award2', 
      userId: 'user1', 
      title: 'Лучший мобильный дизайн', 
      description: 'Специальная награда за проект мобильного приложения', 
      image: '/awards/mobile-award.png',
      date: '2023-06-10T14:45:00Z'
    },
    { 
      id: 'award3', 
      userId: 'user2', 
      title: 'Топ визуализатор 2023', 
      description: 'Награда за выдающиеся работы в области 3D-визуализации', 
      image: '/awards/3d-award.png',
      date: '2023-11-05T09:20:00Z'
    },
    { 
      id: 'award4', 
      userId: 'user3', 
      title: 'Лучший брендинг проект', 
      description: 'Первое место в категории "Брендинг" на международном конкурсе', 
      image: '/awards/branding-award.png',
      date: '2023-09-22T15:10:00Z'
    }
  ];
  
  for (const award of awards) {
    insertAward.run(
      award.id,
      award.userId,
      award.title,
      award.description,
      award.image,
      award.date
    );
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

  const insertCompany = db.prepare(
    'INSERT INTO companies (id, name, description, logo, website, inn, verified, ownerId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  const now = new Date().toISOString();
  
  const companies = [
    {
      id: 'company1',
      name: 'ООО "АртДизайн"',
      description: 'Студия дизайна интерьера и архитектурного проектирования. Более 10 лет опыта в создании уникальных пространств.',
      logo: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=800&auto=format&fit=crop',
      website: 'https://artdesign.example.com',
      inn: '7712345678',
      verified: 1,
      ownerId: 'user1',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'company2',
      name: 'DigitalWave',
      description: 'Агентство цифрового маркетинга и веб-разработки. Создаем сайты, приложения и брендинг для компаний любого масштаба.',
      logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop',
      website: 'https://digitalwave.example.com',
      inn: '7709876543',
      verified: 1,
      ownerId: 'user3',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'company3',
      name: '3D Vision',
      description: 'Студия 3D моделирования и визуализации. Специализируемся на архитектурных визуализациях и моделях для игр.',
      logo: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=800&auto=format&fit=crop',
      website: 'https://3dvision.example.com',
      inn: '7723456789',
      verified: 1,
      ownerId: 'user2',
      createdAt: now,
      updatedAt: now
    }
  ];
  
  for (const company of companies) {
    insertCompany.run(
      company.id,
      company.name,
      company.description,
      company.logo,
      company.website,
      company.inn,
      company.verified,
      company.ownerId,
      company.createdAt,
      company.updatedAt
    );
  }
  
  // Вставляем тестовые вакансии
  const insertJob = db.prepare(`
    INSERT INTO jobs (
      id, title, slug, description, requirements, responsibilities, 
      location, type, salary, category, experience, tags, 
      companyId, featured, active, createdAt, updatedAt, expiresAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const jobs = [
    {
      id: 'job1',
      title: 'UI/UX Дизайнер (Middle)',
      slug: 'ui-ux-designer-middle-job1',
      description: 'Мы ищем опытного UI/UX дизайнера, который присоединится к нашей команде для создания потрясающих пользовательских интерфейсов и улучшения удобства использования наших продуктов.',
      requirements: 'Опыт работы в UI/UX дизайне от 2 лет. Знание Adobe Creative Suite, Figma, Sketch. Понимание принципов юзабилити и умение создавать прототипы. Портфолио с примерами работ.',
      responsibilities: 'Проектирование пользовательских интерфейсов. Создание интерактивных прототипов. Проведение тестирования удобства использования. Сотрудничество с разработчиками для реализации дизайна.',
      location: 'Москва',
      type: 'full-time',
      salary: '100 000 - 150 000 ₽',
      category: 'UI/UX Дизайн',
      experience: 'middle',
      tags: JSON.stringify(['UI/UX', 'Figma', 'Прототипирование', 'Тестирование']),
      companyId: 'company1',
      featured: 1,
      active: 1,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
    },
    {
      id: 'job2',
      title: 'Графический дизайнер',
      slug: 'graphic-designer-job2',
      description: 'Требуется талантливый графический дизайнер с креативным мышлением для создания визуальных материалов для нашей маркетинговой команды.',
      requirements: 'Опыт работы в графическом дизайне от 1 года. Владение Adobe Photoshop, Illustrator, InDesign. Чувство стиля и внимание к деталям. Портфолио с разнообразными работами.',
      responsibilities: 'Создание рекламных материалов, баннеров, брошюр. Разработка визуальной идентичности бренда. Оформление социальных сетей и сайта компании.',
      location: 'Санкт-Петербург',
      type: 'full-time',
      salary: '80 000 - 120 000 ₽',
      category: 'Графический дизайн',
      experience: 'junior',
      tags: JSON.stringify(['Графический дизайн', 'Adobe', 'Брендинг', 'Маркетинг']),
      companyId: 'company2',
      featured: 0,
      active: 1,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString()
    },
    {
      id: 'job3',
      title: '3D Моделлер (Senior)',
      slug: '3d-modeler-senior-job3',
      description: 'Приглашаем опытного 3D моделлера для создания высококачественных моделей для архитектурных проектов и визуализаций.',
      requirements: 'Опыт работы от 4 лет в создании 3D моделей. Глубокое знание 3ds Max, Maya, Blender или аналогичных программ. Понимание принципов освещения и материалов. Сильное портфолио 3D работ.',
      responsibilities: 'Создание детализированных 3D моделей. Текстурирование и настройка материалов. Оптимизация моделей для визуализаций. Сотрудничество с архитекторами и дизайнерами.',
      location: 'Удаленно',
      type: 'remote',
      salary: '150 000 - 200 000 ₽',
      category: '3D Моделирование',
      experience: 'senior',
      tags: JSON.stringify(['3D', 'Моделирование', 'Визуализация', 'Архитектура']),
      companyId: 'company3',
      featured: 1,
      active: 1,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString()
    },
    {
      id: 'job4',
      title: 'Web-дизайнер (Junior)',
      slug: 'web-designer-junior-job4',
      description: 'Ищем начинающего веб-дизайнера для работы над корпоративными сайтами и лендингами.',
      requirements: 'Базовые знания принципов веб-дизайна. Умение работать с Figma или Adobe XD. Понимание HTML/CSS будет плюсом. Наличие примеров работ.',
      responsibilities: 'Создание дизайна веб-страниц. Разработка баннеров и визуальных элементов. Поддержка существующих проектов. Участие в мозговых штурмах.',
      location: 'Москва',
      type: 'part-time',
      salary: '40 000 - 60 000 ₽',
      category: 'UI/UX Дизайн',
      experience: 'junior',
      tags: JSON.stringify(['Веб-дизайн', 'Figma', 'Лендинги', 'HTML/CSS']),
      companyId: 'company2',
      featured: 0,
      active: 1,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString()
    },
    {
      id: 'job5',
      title: 'Дизайнер интерьера',
      slug: 'interior-designer-job5',
      description: 'Компания "АртДизайн" приглашает дизайнера интерьера для работы над коммерческими и жилыми проектами.',
      requirements: 'Опыт работы в дизайне интерьеров от 2 лет. Владение ArchiCAD, AutoCAD, Revit. Знание современных трендов в дизайне интерьеров. Портфолио реализованных проектов.',
      responsibilities: 'Разработка концепции дизайна интерьеров. Создание планов помещений и 3D визуализаций. Подбор материалов, мебели и освещения. Взаимодействие с клиентами и подрядчиками.',
      location: 'Москва',
      type: 'full-time',
      salary: '90 000 - 140 000 ₽',
      category: 'Дизайн интерьера',
      experience: 'middle',
      tags: JSON.stringify(['Интерьер', 'ArchiCAD', '3D Визуализация', 'Проектирование']),
      companyId: 'company1',
      featured: 1,
      active: 1,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString()
    }
  ];
  
  for (const job of jobs) {
    insertJob.run(
      job.id,
      job.title,
      job.slug,
      job.description,
      job.requirements,
      job.responsibilities,
      job.location,
      job.type,
      job.salary,
      job.category,
      job.experience,
      job.tags,
      job.companyId,
      job.featured,
      job.active,
      job.createdAt,
      job.updatedAt,
      job.expiresAt
    );
  }
  
  // Вставляем тестовые блог-посты
  const insertBlogPost = db.prepare(`
    INSERT INTO blog_posts (
      id, title, slug, content, excerpt, coverImage, authorId, category, tags, featured, published, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const blogPosts = [
    {
      id: 'post1',
      title: 'Тренды в дизайне интерфейсов 2025',
      slug: 'ui-design-trends-2025-post1',
      content: '<p>Дизайн пользовательских интерфейсов постоянно эволюционирует, адаптируясь к новым технологиям и меняющимся потребностям пользователей. В 2025 году мы наблюдаем несколько интересных тенденций, которые будут определять направление развития UI/UX дизайна.</p><h2>1. Трехмерные элементы интерфейса</h2><p>С развитием возможностей устройств и браузеров, трехмерные элементы становятся все более популярными в веб-дизайне. Они добавляют глубину и интерактивность, делая взаимодействие с продуктом более запоминающимся.</p><h2>2. Темные режимы по умолчанию</h2><p>Темные темы перестали быть просто альтернативным вариантом – многие приложения теперь используют их по умолчанию. Это связано как с энергосбережением на OLED-экранах, так и с заботой о снижении нагрузки на глаза пользователей.</p><h2>3. Микроанимации и тактильная обратная связь</h2><p>Небольшие, почти незаметные анимации стали важной частью современного интерфейса. Они дают пользователю мгновенную обратную связь и делают взаимодействие с продуктом более естественным.</p><h2>4. Персонализация на основе AI</h2><p>Искусственный интеллект позволяет создавать интерфейсы, которые адаптируются к поведению и предпочтениям конкретного пользователя. Это делает пользовательский опыт более индивидуальным и эффективным.</p><p>Следование этим трендам поможет создавать современные и удобные интерфейсы, отвечающие ожиданиям пользователей в 2025 году.</p>',
      excerpt: 'Обзор актуальных тенденций в дизайне пользовательских интерфейсов, которые определят направление развития UI/UX в 2025 году.',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      authorId: 'user1',
      category: 'UI/UX Дизайн',
      tags: JSON.stringify(['UI/UX', 'Тренды', 'Дизайн интерфейсов', '2025']),
      featured: 1,
      published: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'post2',
      title: 'Как создать эффективное портфолио дизайнера',
      slug: 'how-to-create-effective-design-portfolio-post2',
      content: '<p>Портфолио – это ваша визитная карточка как дизайнера. Оно демонстрирует ваши навыки, стиль и подход к решению задач. Хорошо составленное портфолио может открыть двери к новым возможностям и проектам.</p><h2>Выбор проектов для портфолио</h2><p>Начните с отбора ваших лучших работ. Качество важнее количества – лучше включить 5-7 отличных проектов, чем 20 посредственных. Каждый проект должен демонстрировать определенные навыки и аспекты вашей работы.</p><h2>Структура презентации проекта</h2><p>Для каждого проекта важно представить не только конечный результат, но и процесс работы:</p><ul><li>Описание проблемы или задачи</li><li>Ваш подход к решению</li><li>Ключевые этапы работы</li><li>Использованные инструменты и технологии</li><li>Конечный результат</li><li>Полученные отзывы или метрики успеха</li></ul><h2>Удобная навигация и UI портфолио</h2><p>Дизайн вашего портфолио сам по себе является демонстрацией ваших навыков. Обеспечьте интуитивно понятную навигацию, адаптивный дизайн и быструю загрузку страниц.</p><h2>Личный бренд</h2><p>Добавьте информацию о себе, своем подходе к работе и ценностях. Это поможет создать личный бренд и выделиться среди других кандидатов.</p><p>Хорошее портфолио должно не только демонстрировать ваши работы, но и рассказывать историю вас как профессионала.</p>',
      excerpt: 'Практические советы по созданию эффективного портфолио, которое поможет дизайнеру выделиться и привлечь клиентов или работодателей.',
      coverImage: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=800&auto=format&fit=crop',
      authorId: 'user3',
      category: 'Карьера',
      tags: JSON.stringify(['Портфолио', 'Карьера', 'Советы', 'Саморазвитие']),
      featured: 0,
      published: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'post3',
      title: 'Обновление платформы Canvas: новые возможности для дизайнеров',
      slug: 'canvas-platform-update-new-features-post3',
      content: '<p>Мы рады сообщить о запуске новой версии платформы Canvas с расширенными возможностями для дизайнеров. В этом обновлении мы добавили функции, о которых вы просили, и внесли улучшения на основе ваших отзывов.</p><h2>Новые разделы: Блог и Вакансии</h2><p>Теперь на платформе доступны разделы "Блог" и "Вакансии". В блоге мы будем публиковать статьи о дизайне, советы от экспертов и новости индустрии. Раздел "Вакансии" поможет дизайнерам найти интересные проекты, а компаниям – талантливых специалистов.</p><h2>Улучшенная система комментариев и лайков</h2><p>Мы полностью переработали систему комментариев и лайков, сделав их более интуитивными и функциональными. Теперь вы можете легко отслеживать активность в ваших проектах.</p><h2>Функция "Поделиться"</h2><p>Добавлена функция "Поделиться", которая позволяет распространять ваши работы в социальных сетях одним кликом. Это поможет привлечь больше внимания к вашим проектам.</p><h2>Инструменты для компаний</h2><p>Компании теперь могут создавать свои профили, проходить верификацию и публиковать вакансии для дизайнеров. Это создает экосистему, где талантливые специалисты могут найти интересные проекты.</p><p>Мы продолжаем работать над улучшением платформы Canvas и будем рады вашим отзывам о новых функциях. Спасибо, что выбираете нас для развития вашей карьеры в дизайне!</p>',
      excerpt: 'Представляем новые возможности платформы Canvas: разделы Блог и Вакансии, улучшенные социальные функции и инструменты для компаний.',
      coverImage: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop',
      authorId: 'user1',
      category: 'Новости',
      tags: JSON.stringify(['Canvas', 'Обновление', 'Новые функции', 'Платформа']),
      featured: 1,
      published: 1,
      createdAt: now,
      updatedAt: now
    }
  ];
  
  for (const post of blogPosts) {
    insertBlogPost.run(
      post.id,
      post.title,
      post.slug,
      post.content,
      post.excerpt,
      post.coverImage,
      post.authorId,
      post.category,
      post.tags,
      post.featured,
      post.published,
      post.createdAt,
      post.updatedAt
    );
  }
}

// Вызываем функцию заполнения базы данных
seedDatabase();

export default db;
import type { Project, Story, User, Subscription } from "./types"

const projects: Project[] = [
  {
    id: "1",
    title: "Минималистичный интерфейс приложения",
    description: "Современный и чистый дизайн мобильного приложения с фокусом на удобство использования.",
    image: "/projects/project1.jpg",
    author: "Анна Смирнова",
    authorId: "user1",
    likes: 342,
    views: 1205,
    featured: true,
    category: "2d",
    tags: ["2d", "uxui", "web"],
    createdAt: "2023-12-15T10:30:00Z",
  },
  {
    id: "2",
    title: "3D визуализация интерьера",
    description: "Фотореалистичная 3D визуализация современного интерьера гостиной.",
    image: "/projects/project2.jpg",
    author: "Максим Петров",
    authorId: "user2",
    likes: 289,
    views: 1050,
    featured: true,
    category: "3d",
    tags: ["3d", "interior", "visualization"],
    createdAt: "2023-12-20T14:45:00Z",
  },
  {
    id: "3",
    title: "Брендинг для эко-стартапа",
    description: "Разработка логотипа и фирменного стиля для экологического стартапа.",
    image: "/projects/project3.jpg",
    author: "Елена Козлова",
    authorId: "user3",
    likes: 175,
    views: 820,
    featured: false,
    category: "2d",
    tags: ["2d", "branding", "logo"],
    createdAt: "2023-12-25T09:15:00Z",
  },
]

const stories: Story[] = [
  {
    id: "1",
    imageUrl: "/stories/story1.jpg",
    title: "Новый конкурс!",
    content: "Участвуйте в нашем новом конкурсе и выигрывайте ценные призы от спонсоров.",
    link: "/contests/new",
    createdAt: "2024-02-28T10:00:00Z",
  },
  {
    id: "2",
    imageUrl: "/stories/story2.jpg",
    title: "Обновление платформы",
    content: "Мы добавили новые функции для улучшения вашего опыта. Узнайте о них первыми!",
    link: "/blog/platform-update",
    createdAt: "2024-02-27T15:30:00Z",
  },
  {
    id: "3",
    imageUrl: "/stories/story3.jpg",
    title: "Мастер-класс",
    content: "Не пропустите онлайн мастер-класс по 3D моделированию завтра в 19:00.",
    link: "/events/3d-modeling-masterclass",
    createdAt: "2024-02-26T12:45:00Z",
  },
  {
    id: "4",
    imageUrl: "/stories/story4.jpg",
    title: "Тренды дизайна 2024",
    content: "Узнайте, какие тренды в дизайне будут актуальны в этом году.",
    link: "/blog/design-trends-2024",
    createdAt: "2024-02-25T09:15:00Z",
  },
  {
    id: "5",
    imageUrl: "/stories/story5.jpg",
    title: "Новые инструменты",
    content: "Обзор новых инструментов, которые помогут улучшить ваш рабочий процесс.",
    link: "/resources/new-tools",
    createdAt: "2024-02-24T14:20:00Z",
  },
]

const users: User[] = [
  {
    id: "user1",
    name: "Анна Смирнова",
    avatarUrl: "/users/anna-smirnova.jpg",
    coverImageUrl: "/covers/anna-smirnova-cover.jpg",
    email: "anna.smirnova@example.com",
    subscriptionType: "premium",
    bio: "UX/UI дизайнер с 5-летним опытом",
    about:
      "Я специализируюсь на создании интуитивно понятных и визуально привлекательных интерфейсов для веб- и мобильных приложений. Мой подход основан на глубоком понимании пользовательского опыта и современных тенденций дизайна.",
    followers: 1250,
    following: 350,
    skills: ["UI Design", "UX Research", "Prototyping", "Figma", "Adobe XD"],
    socialLinks: {
      instagram: "https://instagram.com/anna.smirnova",
      behance: "https://behance.net/anna.smirnova",
      dribbble: "https://dribbble.com/anna.smirnova",
    },
    registrationDate: "2022-03-15T09:00:00Z",
    awards: [
      {
        id: "award1",
        name: "Лучший дизайн года",
        description: "За выдающийся вклад в развитие UX/UI дизайна",
        imageUrl: "/awards/best-design.svg",
        dateReceived: "2023-12-01T00:00:00Z",
      },
    ],
  },
  {
    id: "user2",
    name: "Максим Петров",
    avatarUrl: "/users/maxim-petrov.jpg",
    coverImageUrl: "/covers/maxim-petrov-cover.jpg",
    email: "maxim.petrov@example.com",
    subscriptionType: "standard",
    bio: "3D художник и аниматор",
    about:
      "Создаю реалистичные 3D модели и анимации для игр и фильмов. Мои работы отличаются вниманием к деталям и стремлением к фотореалистичности.",
    followers: 980,
    following: 210,
    skills: ["3D Modeling", "Texturing", "Animation", "Blender", "Maya"],
    socialLinks: {
      instagram: "https://instagram.com/maxim.petrov",
      twitter: "https://twitter.com/maxim.petrov",
    },
    registrationDate: "2022-05-20T14:30:00Z",
    awards: [],
  },
]

const subscriptions: Subscription[] = [
  {
    id: "sub1",
    userId: "user2",
    userName: "Максим Петров",
    userAvatarUrl: "/users/maxim-petrov.jpg",
  },
  {
    id: "sub2",
    userId: "user3",
    userName: "Елена Козлова",
    userAvatarUrl: "/users/elena-kozlova.jpg",
  },
]

export function getAllProjects(): Project[] {
  return projects
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter((project) => project.category === category)
}

export function getAllStories(): Story[] {
  return stories
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getProjectsByUserId(userId: string): Project[] {
  return projects.filter((project) => project.authorId === userId)
}

export function getSubscriptionsByUserId(userId: string): Subscription[] {
  return subscriptions.filter((sub) => sub.userId === userId)
}

export function getFollowersByUserId(userId: string): Subscription[] {
  // В реальном приложении здесь был бы запрос к базе данных
  // Для демонстрации вернем фиктивные данные
  return subscriptions
}

export function getRecommendedUsers(): User[] {
  // В реальном приложении здесь была бы логика рекомендаций
  // Для демонстрации вернем несколько пользователей
  return users.slice(0, 4)
}


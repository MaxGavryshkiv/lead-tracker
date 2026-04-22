# 🚀 Lead Tracking System

Система для управління лідами з можливістю коментування, фільтрації та моніторингу статусів. Проект розроблений як тестове завдання на позицію **Full-Stack Middle Developer**.

## 🛠 Технологічний стек

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Axios, Lucide Icons.
- **Backend**: NestJS, TypeScript, Prisma ORM.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker, Docker Compose.

## ✨ Основні можливості

- **Управління лідами**: Створення, перегляд, зміна статусів та видалення.
- **Система коментарів**: Додавання коментарів до лідів з валідацією довжини (від 50 символів).
- **Фільтрація та сортування**: Пошук за текстом, фільтрація за статусом та динамічне сортування.
- **Docker-first**: Повністю налаштоване середовище для швидкого розгортання.

---

## 🚀 Швидкий запуск (Docker)

Проект повністю докеризований та готовий до роботи на будь-якій системі (включаючи Apple Silicon M1/M2/M3).

1. **Клонуйте репозиторій:**

   ```bash
   git clone <your-repo-url>
   cd lead-tracker
   ```

2. **Запустіть контейнери:**

   docker compose up --build

3. **Додатки будуть доступні за адресами:**

🌐 Frontend: http://localhost:3000

⚙️ Backend API: http://localhost:3001/api

📄 Swagger UI: http://localhost:3001/api/docs

---

### 💻 Локальна розробка (без Docker)

**Backend**

Перейдіть у папку: cd backend

Встановіть залежності: npm install

Створіть файл .env на основі .env.example та вкажіть ваш DATABASE_URL.

Запустіть міграції Prisma: npx prisma migrate dev

Запустіть сервер: npm run start:dev

**Frontend**

Перейдіть у папку: cd frontend

Встановіть залежності: npm install

Створіть файл .env.local на основі .env.example.

Запустіть проект: npm run dev

| #   | Метод | Ендпоінт                | Опис                             |
| --- | ----- | ----------------------- | -------------------------------- |
| 1   | GET   | /api/leads              | Отримати список лідів            |
| 2   | POST  | /api/leads              | Створення нового ліда            |
| 3   | GET   | /api/leads/:id          | Детальна інформація про ліда     |
| 4   | PATCH | /api/leads/:id          | Оновлення статусу або даних ліда |
| 5   | GET   | /api/leads/:id/comments | Отримати всі коментарі до ліда   |
| 6   | POST  | /api/leads/:id/comments | Додати новий коментар            |

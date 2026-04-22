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

1. **Клонуйте репозиторій:**

   ```bash
   git clone https://github.com/MaxGavryshkiv/lead-tracker
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

Перейдіть у папку:

```bash
cd backend
```

Встановіть залежності:

```bash
npm install
```

Створіть файл .env на основі .env.example та вкажіть ваш DATABASE_URL.

Запустіть міграції Prisma:

```bash
npx prisma migrate dev
```

Запустіть сервер:

```bash
npm run start:dev
```

**Frontend**

Перейдіть у папку:

```bash
cd frontend
```

Встановіть залежності:

```bash
npm install
```

Створіть файл .env.local на основі .env.example.

Запустіть проект:

```bash
npm run dev
```

Найзручніший спосіб ознайомитися з усіма методами — скористатися Swagger UI:
http://localhost:3001/api/docs

| #   | Метод | Ендпоінт                | Опис                                                     |
| --- | ----- | ----------------------- | -------------------------------------------------------- |
| 1   | GET   | /api/leads              | Запит повертає список лідів з пагінацією та фільтрацією. |
| 2   | POST  | /api/leads              | Створення нового ліда                                    |
| 3   | GET   | /api/leads/:id          | Детальна інформація про ліда                             |
| 4   | PATCH | /api/leads/:id          | Оновлення статусу або даних ліда                         |
| 5   | GET   | /api/leads/:id/comments | Отримати всі коментарі до ліда                           |
| 6   | POST  | /api/leads/:id/comments | Додати новий коментар                                    |

1. Отримати всіх лідів(GET):
   "http://localhost:3001/api/leads?status=NEW&sort=createdAt&order=desc"

2. Створення нового ліда(POST):
   "http://localhost:3001/api/leads"
   {
   "name": "Dmitry Smith",
   "email": "d.smith@google.com",
   "company": "Google",
   "status": "IN_PROGRESS",
   "value": 15000,
   "notes": "VIP клієнт, потрібен особливий підхід"
   }

3. Отримати інформацію про ліда(GET):
   "http://localhost:3001/api/leads/1"

4. Оновлення ліда(PATCH):
   "http://localhost:3001/api/leads/1"
   {
   "status": "IN_PROGRESS"
   }

5. Отримати всі коментарі до ліда(GET):
   "http://localhost:3001/api/leads/1/comments"

6. Додати новий коментар(POST):
   "http://localhost:3001/api/leads/1/comments"
   {
   "content": "Це розлогий технічний коментар для перевірки ендпоінта."
   }

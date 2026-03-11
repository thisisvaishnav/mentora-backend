# Mentora Backend API

Mentora Backend is a Node.js and Express-based REST API designed for a mentoring platform. It allows Mentors to create lessons and sessions, while Parents can add students and book lessons for them.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Prisma**: Next-generation Node.js and TypeScript ORM.
- **PostgreSQL**: Relational database used for storing data.
- **Zod**: TypeScript-first schema declaration and validation library.
- **JSON Web Tokens (JWT)**: Secure user authentication.
- **Google Generative AI (Gemini APIs)**: Integrated to generate AI summaries.

## Features & Roles

### Roles

- **MENTOR**: Can create lessons and schedule sessions for those lessons.
- **PARENT**: Can register their students and book lessons for them.

### Features

- **Authentication**: User registration and login with role-based JWT generation.
- **Student Management**: Parents can register and list their students.
- **Lesson Management**: Mentors can create custom lessons.
- **Session Management**: Mentors can schedule sessions for specific lessons they own.
- **Booking Management**: Parents can book lessons for their students.
- **AI Integrations**: Ready integration with Gemini APIs (`geminiService.js`) to provide session summaries and other AI features.

---

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) database running

### 1. Clone the repository and install dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Create a \`.env\` file in the root directory and update it with your settings:

\`\`\`env

# .env

PORT=5001
DATABASE_URL="postgresql://user:password@localhost:5432/mentora_db?schema=public"
JWT_SECRET="your_jwt_secret_here"
GEMINI_API_KEY="your_google_gemini_api_key"
\`\`\`

### 3. Database Setup (Prisma)

Run Prisma migrations to set up your PostgreSQL database schema:

\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

### 4. Start the Application

**Development mode:**
\`\`\`bash
npm run dev
\`\`\`

The server will be running at \`http://localhost:5001\` (or the port defined in your \`.env\`).

---

## API Endpoints Overview

### Health Check

- \`GET /\` - Returns an "API running" message.

### Authentication (\`/auth\`)

- \`POST /auth/register\` - Register a new user (\`role\`: "MENTOR" or "PARENT")
- \`POST /auth/login\` - Authenticate user and receive a JWT

### Students (\`/students\`) _Requires Authentication_

- \`POST /students\` - Create a student (Parent only)
- \`GET /students\` - Get a list of the authenticated Parent's students

### Lessons (\`/lessons\`) _Requires Authentication_

- \`POST /lessons\` - Create a new lesson (Mentor only)
- \`GET /lessons/:id/sessions\` - Fetch sessions for a specific lesson (Mentors view their own; Parents view booked ones)

### Sessions (\`/sessions\`) _Requires Authentication_

- \`POST /sessions\` - Create a session for a lesson (Mentor only)

### Bookings (\`/bookings\`) _Requires Authentication_

- \`POST /bookings\` - Book a lesson for a student (Parent only)

---

## Project Structure

\`\`\`
├── prisma/
│ └── schema.prisma # Database models and relations
├── src/
│ ├── config/ # Prisma and other configurations
│ ├── controllers/ # Route logic handlers
│ ├── middleware/ # Auth and validation middlewares
│ ├── routes/ # Express routing definitions
│ ├── services/ # Third-party integrations (e.g., Gemini)
│ ├── utils/ # Utility and helper functions
│ └── index.js # Entry point of the server
├── .env # Environment variables
├── package.json # App dependencies and scripts
└── README.md # Project documentation
\`\`\`

## License

ISC

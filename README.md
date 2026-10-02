# Message Board 💬

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-black?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=black)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

> Full-stack, message board website with pagination, JWT authentication and comprehensive testing coverage. Built to become a simple forum-style discussion platform.

## 📖 Project Description

Inspired by classic forums, "Message Board" allows users to register, login, post messages, like/dislike posts and manage their own content with full ownership authorization. The website features a clean and responsive UI with accessibility considerations and robust backend security.

## 🌐 Live Demo

🔗 [Message Board](https://message-board-71n7.vercel.app/)

## ✨ Features

### 🎯 Core Features
- **Message Posting**: Create messages with real-time validation
- **Like/Dislike System**: Anti-spam protection and prevents users from liking their own messages
- **Pagination**: Improve database performance by fetching "page by page" messages instead of everything at once
- **Responsive Design**: Mobile-first layout with Tailwind CSS

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Stateless, secure token system
- **Password Hashing**: bcrypt for secure credential storage
- **Owner Authorization**: Users can only delete their own messages
- **Protected and Secured Routes**: Put in place an authentication middleware that check if the user is logged in and his id for targeted operation

### 🎨 User Experience
- **Loading States**: Skeleton loaders and spinners during async operations
- **Toast Notifications**: Simple and non-intrusive notifications for all user actions
- **Form Validation**: Real-time input validation on both client and server
- **Confirmation Window**: Prevent accidental message deletion

### 🧪 Testing Coverage
- **Integration Tests**: Vitest + Supertest for all API endpoints
- **Component Tests**: Vitest + React Testing Library for components
- **E2E Tests**: Playwright for user flow registration

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks and context |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **React Router** | Client-side routing |
| **React Hot Toast** | Toast notifications |
| **Lucide Icons** | Icon library |
| **clsx** | Conditional className management |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API framework |
| **TypeScript** | Type-safe server code |
| **Drizzle ORM** | Type-safe SQL queries |
| **PostgreSQL (Neon)** | Serverless database |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcrypt** | Password hashing |
| **cors** | Cross-origin resource sharing |

### Testing
| Technology | Purpose |
|------------|---------|
| **Vitest** | Test runner for both frontend/backend |
| **Supertest** | HTTP assertions for API |
| **@testing-library/react** | Component testing |
| **Playwright** | End-to-end browser testing |
| **jsdom** | Browser environment simulation |

### DevOps & Tools
- **GitHub Actions**: CI/CD pipeline
- **Thunder Client**: API testing during development
- **Vercel**: Frontend deployment
- **Railway**: Backend deployment

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon free tier recommended)
- Git

### Client side guide
1. Clone the repository: `git clone https://github.com/Haveadream1/message-board`
2. Move to client directory `cd client`
3. Install dependencies: `npm install`
4. Copy the `.env.example` file in client to `.env`
5. Follow the example and add your environment variables
5. Start the client development: `npm run dev` 
6. Run tests: 
   - Unit Component tests: `npm run test`
   - E2E tests: `npm run test:e2e`
   or 
   - Test both: `npm run test:all`
7. Go back to root `cd ...`

### Server side guide
1. Move to server directory `cd server`
2. Install dependencies: `npm install`
3. Copy the `.env.example` file in server to `.env` 
4. Follow the example and add your environment variables
5. Start the server development: `npm run dev` 
6. Run test: 
   - Integration tests: `npm run test`

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | ❌ | Health check |
| POST | `/auth/register` | ❌ | Create account |
| POST | `/auth/login` | ❌ | Login into account |
| GET | `/messages?offset=&limit=` | ❌ | Paginated messages |
| POST | `/messages` | ✅ | Create message |
| DELETE | `/messages/:id` | ✅ | Delete own message |
| PUT | `/messages/:id/like` | ✅ | Increment like count |
| DELETE | `/messages/:id/like` | ✅ | Decrement like count  and delete instance in junction table|

## 🚧 Future Enhancements
* Implement thier-party authentication (Github, Line, Kakao, WeChat)
* Develop reply/quote functionality

## 🙌 Credits
- **Icons:** [Tabler](https://tabler.io/icons) & [Lucide](https://lucide.dev/)
- **Image:** [Héctor J. Rivas's image](https://unsplash.com/fr/photos/photo-en-contre-plongee-dun-batiment-de-mur-rideau-1FxMET2U5dU)
- **Hosting:** [Render](https://render.com/) & [Vercel](https://vercel.com/) 
- **PostgreSQL serverless:** [Neon](https://neon.com/)
- **Accessibility checker:** [WebYes](https://www.webyes.com/)
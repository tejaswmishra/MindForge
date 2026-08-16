<div align="center">

# 🧠 MindForge

**AI-Powered Learning Platform**

Transform your study materials into personalized AI-generated quizzes and flashcards with intelligent spaced repetition. MindForge turns any PDF, Word doc, or text file into an adaptive learning experience that helps you master your coursework efficiently.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?logo=postgresql&logoColor=white)](https://orm.drizzle.team/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_2.5-8E75FF?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk_v6-6C47FF)](https://clerk.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**⭐ Star this repository if you find it helpful!**

</div>

---

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Smart Quiz Generation** — upload a PDF, DOCX, or TXT file and let Gemini AI create a personalized quiz
- **Intelligent Flashcards** — automatically generate study flashcards from your course materials
- **Multiple Question Types** — MCQ, True/False, and Short Answer, with varied difficulty
- **Topic-Based Organization** — AI tags content by topic for targeted review

### 📊 Advanced Analytics
- **Performance Dashboard** — visualize learning progress with interactive charts
- **Topic Analysis** — spot weak areas with color-coded accuracy breakdowns
- **Progress Tracking** — monitor quiz scores, completion rates, and study patterns over the last 30 days
- **Recent Activity** — quick access to your last 10 quizzes with one-click review or retake

### 🎴 Spaced Repetition System
- **SM-2 Algorithm** — scientifically-proven spaced repetition for optimal retention
- **Adaptive Scheduling** — cards resurface at the interval your recall performance earns
- **Confidence Rating** — a 4-level rating system: Again, Hard, Good, Easy
- **Due Card Management** — always know exactly what's due for review today

### 🎯 Smart Quiz System
- **Configurable Length & Difficulty** — 5–20 questions, Mixed/Easy/Medium/Hard
- **Instant Feedback** — detailed explanations for correct and incorrect answers
- **Live Progress** — question counter, timer, answered count, and progress bar while you work
- **Comprehensive Results** — question-by-question breakdown after submission

### 🔐 Secure & Modern
- **Authentication** — Clerk-powered secure user management with automatic account sync
- **Data Privacy** — every syllabus, quiz, flashcard, and response is scoped to its owner
- **Production Ready** — error boundaries, loading skeletons, and performance monitoring built in
- **SEO Optimized** — proper meta tags, manifest, and crawl configuration

---

## 🚀 How it works

```mermaid
flowchart LR
    A[📤 Upload Material] --> B[🤖 AI Generation]
    B --> C[📝 Take Quiz]
    B --> D[🗂️ Study Flashcards]
    C --> E[📊 Dashboard Analytics]
    D --> E
```

1. **Upload** a PDF, DOCX, or TXT file (up to 10MB) with an optional title and subject.
2. **Generate** a quiz or flashcard deck — choose the length and difficulty.
3. **Study** — take the quiz or review due flashcards with a click-to-flip, rate-your-recall flow.
4. **Track** — the dashboard turns your responses into accuracy trends, topic breakdowns, and history.

---

## 🛠️ Tech Stack

### Frontend
| | |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS, shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |

### Backend
| | |
|---|---|
| API | Next.js API Routes |
| Database | PostgreSQL (Neon.tech-compatible) |
| ORM | Drizzle ORM |
| AI | Google Gemini 2.5 — Flash (primary) & Pro (fallback) |

### Authentication & Security
| | |
|---|---|
| Auth | Clerk v6+ |
| Middleware | Protected routes and user sync |
| Validation | Server-side input validation |

### File Processing
| | |
|---|---|
| PDF | pdf-parse |
| DOCX | Mammoth |
| TXT | Native Node.js processing |

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- A reachable PostgreSQL database (Neon.tech works well)
- A Clerk account (publishable + secret key)
- A Google Gemini API key

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/tejaswmishra/MindForge.git
cd MindForge

# 2. Install dependencies
npm install
```

**3. Environment Variables**

Create a `.env.local` file in the repo root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# AI
GEMINI_API_KEY=your_gemini_api_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Keep `.env.local` out of version control — never commit real secrets.

```bash
# 4. Set up the database
npm run db:generate   # generate Drizzle migration files
npm run db:migrate    # apply migrations
npm run db:studio     # (optional) inspect the database

# 5. Run the dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign up to get started.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Turbopack development server |
| `npm run build` | Create a production build (`--no-lint`) |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Apply Drizzle migrations |
| `npm run db:studio` | Open Drizzle Studio |

---

## 📖 Usage

### 1. Upload Study Materials
Navigate to the Upload page, drag & drop (or select) a PDF, DOCX, or TXT file, add an optional title and subject, and let MindForge extract and save the content.

### 2. Generate Quizzes
Select an uploaded material, choose 5–20 questions, pick a difficulty (Mixed, Easy, Medium, Hard), and generate a personalized quiz in seconds.

### 3. Take Quizzes
Work through an interactive quiz with a live timer, question navigator, and progress bar, then get instant results with explanations.

### 4. Study Flashcards
Generate flashcards from your materials and review them with the spaced-repetition study flow — rate your confidence on each card to shape its next review date.

### 5. Monitor Progress
Check the analytics dashboard for performance charts over time, topic-wise accuracy, and your recent quiz history.

---

## 🏗️ Project Structure

```
mindforge/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── upload/       # File upload
│   │   │   ├── quiz/         # Quiz generation & submission
│   │   │   ├── flashcards/   # Flashcard management
│   │   │   └── dashboard/    # Analytics
│   │   ├── dashboard/        # Analytics page
│   │   ├── flashcards/       # Flashcard pages
│   │   ├── quiz/             # Quiz pages
│   │   ├── test/             # Upload & generation
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── analytics/        # Dashboard components
│   │   ├── flashcards/       # Flashcard components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSystem.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── gemini.ts         # AI integration
│   │   ├── gemini-flashcards.ts
│   │   ├── database.ts       # Drizzle setup
│   │   ├── auth.ts           # Clerk helpers
│   │   ├── seo.ts            # SEO utilities
│   │   └── performance.ts    # Monitoring
│   └── types/                # TypeScript types
├── drizzle/
│   ├── schema.ts              # Database schema
│   └── migrations/            # SQL migrations
└── public/                    # Static assets
```

---

## 🗄️ Database Schema

The application uses seven main tables:

| Table | Purpose |
|---|---|
| `users` | User accounts and profiles (synced from Clerk) |
| `syllabi` | Uploaded course materials |
| `questions` | Question bank generated from syllabi |
| `quiz` | Quiz instances |
| `quiz_questions` | Quiz-to-question relationships |
| `quiz_responses` | User quiz submissions |
| `flashcards` | Study flashcards with spaced-repetition metadata |
| `user_progress` | Learning progress tracking |

---

## 🎨 Key Implementation Details

### AI Quiz & Flashcard Generation
Uses Google Gemini with a fallback pattern for reliability:
- **Primary**: Gemini 2.5 Flash (fast, efficient)
- **Fallback**: Gemini 2.5 Pro (more capable)
- Retry logic with exponential backoff
- Structured JSON output with validation before saving

### Spaced Repetition
Implements the SM-2 algorithm:
- Quality ratings from 0–5 (mapped to Again/Hard/Good/Easy)
- Dynamic interval calculation based on repetition count and ease factor
- Ease factor floor of 130 to prevent runaway shortening
- Automatic scheduling of the next due date

### Real-Time Analytics
- Server-side aggregation queries scoped to the signed-in user
- 30-day performance-over-time tracking
- Topic-wise accuracy analysis with color-coded thresholds (≥80% green, 60–79% yellow, <60% red)
- Visual data representation with Recharts

---

## 🚢 Deployment

### Recommended Platforms
- **Vercel** — optimal for Next.js, one-click deploy
- **Netlify** — alternative with good Next.js support
- **Railway / Render** — full-stack deployment with managed Postgres

### Build for Production
```bash
npm run build
npm start
```

Make sure every environment variable from `.env.local` is also configured in your deployment platform before going live.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Run `npm run lint` and open a Pull Request

---

## 📊 Project Status

- ✅ Core features complete
- ✅ AI integration working
- ✅ Analytics dashboard
- ✅ Spaced repetition system
- ✅ Production ready
- 🚧 Mobile app (future)
- 🚧 Collaborative features (future)

## 🐛 Known Issues

No major issues currently. Check the [Issues](https://github.com/tejaswmishra/MindForge/issues) page for updates.

## 💡 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics with ML insights
- [ ] Export quiz results to PDF
- [ ] Integration with popular LMS platforms
- [ ] Voice-enabled quiz taking
- [ ] Gamification with achievements
- [ ] Social learning features
- [ ] Auto-refresh dashboard/flashcard stats after generation
- [ ] Dedicated card-management screen for editing/deleting flashcards

---

## 📄 License

Distributed under the MIT License — see [LICENSE](LICENSE) for details.

## 👨‍💻 Author

**Tejaswi Mishra**
- GitHub: [@tejaswmishra](https://github.com/tejaswmishra)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [Vercel](https://vercel.com/) — Deployment platform
- [Clerk](https://clerk.com/) — Authentication
- [Google Gemini](https://ai.google.dev/) — AI models
- [Neon](https://neon.tech/) — PostgreSQL hosting
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Drizzle ORM](https://orm.drizzle.team/) — Database ORM

---

<div align="center">

**Made with ❤️ by Tejaswi Mishra**

</div>

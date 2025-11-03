# 🧠 Mind Forge - AI-Powered Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Transform your study materials into personalized AI-generated quizzes and flashcards with intelligent spaced repetition. Mind Forge leverages cutting-edge AI to create an adaptive learning experience that helps students master their coursework efficiently.

![Mind Forge Dashboard](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Mind+Forge+Dashboard)

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Smart Quiz Generation**: Upload PDFs, Word documents, or text files and let Gemini AI create personalized quizzes
- **Intelligent Flashcards**: Automatically generate study flashcards from your course materials
- **Multiple Question Types**: MCQ, True/False, and Short Answer questions with varied difficulty levels
- **Topic-Based Organization**: AI categorizes content by topics for targeted learning

### 📊 Advanced Analytics
- **Performance Dashboard**: Visualize your learning progress with interactive charts
- **Topic Analysis**: Identify weak areas with detailed performance breakdowns
- **Progress Tracking**: Monitor quiz scores, completion rates, and study patterns
- **Learning Insights**: Data-driven recommendations for optimal study strategies

### 🎴 Spaced Repetition System
- **SM-2 Algorithm**: Scientifically-proven spaced repetition for optimal retention
- **Adaptive Scheduling**: Cards appear at optimal intervals based on your performance
- **Confidence Rating**: 4-level rating system (Again, Hard, Good, Easy)
- **Due Card Management**: Focus on what needs review today

### 🎯 Smart Quiz System
- **Adaptive Difficulty**: Questions adjust based on your performance
- **Instant Feedback**: Detailed explanations for correct and incorrect answers
- **Progress Indicators**: Real-time tracking during quiz sessions
- **Comprehensive Results**: Question-by-question breakdown with explanations

### 🔐 Secure & Modern
- **Authentication**: Clerk-powered secure user management
- **Data Privacy**: User-specific content with proper access control
- **Production Ready**: Error boundaries, loading states, and performance monitoring
- **SEO Optimized**: Proper meta tags and structured data

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Drizzle ORM
- **AI**: Google Gemini 2.5 (Flash & Pro models)

### Authentication & Security
- **Auth**: Clerk v6+
- **Middleware**: Protected routes and user sync
- **Validation**: Server-side input validation

### File Processing
- **PDF**: pdf-parse
- **DOCX**: Mammoth
- **Text**: Native Node.js processing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Clerk account
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/tejaswmishra/MindForge.git
cd MindForge
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**

Create a `.env.local` file in the root directory:

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

4. **Database Setup**
```bash
# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Drizzle Studio
npm run db:studio
```

5. **Run Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Usage

### 1. Upload Study Materials
- Navigate to the Upload page
- Drag & drop or select PDF, DOCX, or TXT files
- Add title and subject information
- AI processes and extracts content

### 2. Generate Quizzes
- Select uploaded course material
- Choose number of questions (5-20)
- Select difficulty level (Mixed, Easy, Medium, Hard)
- AI generates personalized quiz in seconds

### 3. Take Quizzes
- Interactive quiz interface with timer
- Multiple question types with visual feedback
- Progress tracking and navigation
- Instant results with detailed explanations

### 4. Study Flashcards
- Generate flashcards from your materials
- Study with spaced repetition algorithm
- Rate your confidence on each card
- Track your learning progress

### 5. Monitor Progress
- View comprehensive analytics dashboard
- Performance charts over time
- Topic-wise accuracy breakdown
- Recent quiz history and scores

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
│   ├── schema.ts            # Database schema
│   └── migrations/          # SQL migrations
└── public/                  # Static assets
```

## 🗄️ Database Schema

The application uses 7 main tables:

- **users**: User accounts and profiles
- **syllabi**: Uploaded course materials
- **questions**: Question bank from syllabi
- **quiz**: Quiz instances
- **quiz_questions**: Quiz-question relationships
- **quiz_responses**: User quiz submissions
- **flashcards**: Study flashcards with spaced repetition
- **user_progress**: Learning progress tracking

## 🎨 Key Features Implementation

### AI Quiz Generation
Uses Google Gemini with fallback pattern for reliability:
- Primary: Gemini 2.5 Flash (fast, efficient)
- Fallback: Gemini 2.5 Pro (more capable)
- Retry logic with exponential backoff
- Structured JSON output with validation

### Spaced Repetition
Implements SM-2 algorithm:
- Quality ratings (0-5)
- Dynamic interval calculation
- Ease factor adjustment
- Optimal review scheduling

### Real-time Analytics
- Server-side aggregation queries
- Performance over time tracking
- Topic-wise accuracy analysis
- Visual data representation with Recharts

## 🚢 Deployment

### Recommended Platforms
- **Vercel**: Optimal for Next.js (one-click deploy)
- **Netlify**: Alternative with good Next.js support
- **Railway/Render**: Full-stack deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tejaswi Mishra**
- GitHub: [@tejaswmishra](https://github.com/tejaswmishra)
- LinkedIn: [Add your LinkedIn]
- Portfolio: [Add your portfolio]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Clerk](https://clerk.com/) - Authentication
- [Google Gemini](https://ai.google.dev/) - AI models
- [Neon](https://neon.tech/) - PostgreSQL hosting
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM

## 📊 Project Status

- ✅ Core Features Complete
- ✅ AI Integration Working
- ✅ Analytics Dashboard
- ✅ Spaced Repetition System
- ✅ Production Ready
- 🚧 Mobile App (Future)
- 🚧 Collaborative Features (Future)

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

---

**Star ⭐ this repository if you find it helpful!**

Made with ❤️ by Tejasw Mishra
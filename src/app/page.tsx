'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Quiz Generation",
      description: "Advanced Gemini AI creates personalized quizzes from your course materials with multiple question types and difficulty levels."
    },
    {
      icon: "📊",
      title: "Smart Analytics Dashboard",
      description: "Track your learning progress with detailed performance metrics, topic analysis, and visual progress charts."
    },
    {
      icon: "📚",
      title: "Multi-Format File Support",
      description: "Upload PDFs, Word documents, or text files. Our system intelligently extracts and processes your content."
    },
    {
      icon: "⚡",
      title: "Instant Assessment",
      description: "Get immediate feedback with detailed explanations and performance insights to accelerate your learning."
    },
    {
      icon: "🎯",
      title: "Adaptive Difficulty",
      description: "Questions adapt to your skill level with intelligent mixing of easy, medium, and hard problems."
    },
    {
      icon: "🔄",
      title: "Continuous Learning",
      description: "Practice with unlimited quiz variations from the same material to reinforce your knowledge."
    }
  ];

  const techStack = [
    { name: "Next.js 15", color: "bg-black text-white" },
    { name: "TypeScript", color: "bg-blue-600 text-white" },
    { name: "PostgreSQL", color: "bg-blue-500 text-white" },
    { name: "Gemini AI", color: "bg-purple-600 text-white" },
    { name: "Tailwind CSS", color: "bg-teal-600 text-white" },
    { name: "Drizzle ORM", color: "bg-green-600 text-white" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Unified Navigation */}
      <Navigation variant="transparent" />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              AI-Powered Learning Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              Transform Your Study
              <br />
              Materials Into Quizzes
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload your course materials and let our AI generate personalized quizzes instantly. 
              Track your progress, identify weak areas, and accelerate your learning with intelligent assessments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isSignedIn ? (
                <>
                  <Button size="lg" className="px-8 py-6 text-lg" asChild>
                    <a href="/test">🚀 Start Learning Now</a>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                    <a href="/dashboard">📊 View Dashboard</a>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="px-8 py-6 text-lg" asChild>
                    <a href="/sign-up">🎯 Get Started Free</a>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                    <a href="/sign-in">Sign In</a>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">AI-Powered</div>
                <p className="text-sm text-muted-foreground">Quiz Generation</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Multiple</div>
                <p className="text-sm text-muted-foreground">Question Types</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
                <p className="text-sm text-muted-foreground">Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to supercharge your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to transform your study experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Materials</h3>
              <p className="text-muted-foreground">
                Upload your PDFs, Word docs, or text files containing course materials, syllabi, or study notes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Generation</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your content and generates personalized quizzes with varied difficulty levels.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn & Track</h3>
              <p className="text-muted-foreground">
                Take quizzes, get instant feedback, and track your progress with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech" className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-muted-foreground">
              Leveraging cutting-edge tools for optimal performance and scalability
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {techStack.map((tech, index) => (
              <Badge key={index} className={`px-4 py-2 text-sm font-medium ${tech.color}`}>
                {tech.name}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 Frontend Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Next.js 15 with TypeScript for type-safe, high-performance web applications. 
                  Tailwind CSS and shadcn/ui for beautiful, responsive design.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗄️ Robust Backend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  PostgreSQL database with Drizzle ORM for efficient data management. 
                  Clerk authentication for secure user management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the AI-powered learning revolution. Upload your first document and 
            experience personalized quiz generation in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <>
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg" asChild>
                  <a href="/test">📚 Upload Materials</a>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary" asChild>
                  <a href="/dashboard">📊 View Dashboard</a>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg" asChild>
                  <a href="/sign-up">🎯 Get Started Free</a>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary" asChild>
                  <a href="/sign-in">Sign In to Continue</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">Mind Forge</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
              <a href="/test" className="hover:text-foreground transition-colors">Upload</a>
              <span>Built with ❤️ using Next.js & AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
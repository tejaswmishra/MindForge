import { UploadForm } from '@/components/UploadForm';
import { QuizGenerator } from '@/components/QuizGenerator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from '@/components/Navigation';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <PageLayout showBreadcrumb>
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-6 bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-teal-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            AI Quiz Generation
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Upload & Generate
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your course materials and let our AI create personalized quizzes instantly. 
            Follow the simple two-step process below.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="font-medium">Upload Materials</span>
            </div>
            <div className="w-12 h-px bg-gradient-to-r from-purple-500 to-teal-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="font-medium">Generate Quiz</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1: Upload Section */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📚</span>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Step 1: Upload Syllabus
              </CardTitle>
              <CardDescription className="text-base">
                Upload your PDF, Word document, or text file containing course materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm />
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  Supported Formats
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    PDF Files
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Word Documents
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Text Files
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB • Files are processed securely and privately
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Quiz Generation Section */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">🧠</span>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Step 2: Generate Quiz
              </CardTitle>
              <CardDescription className="text-base">
                AI creates personalized quizzes with mixed difficulty levels and question types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizGenerator />
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  Quiz Features
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Multiple Choice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>True/False</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Short Answer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span>Mixed Difficulty</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  AI-powered generation with instant feedback and detailed explanations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-teal-950/20 border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Need Help Getting Started?</h3>
              <p className="text-muted-foreground mb-4">
                Follow our simple process: upload your study materials, then generate AI-powered quizzes to test your knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <a href="/dashboard">
                    📊 View Dashboard
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">
                    🏠 Back to Home
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">AI-Powered</div>
            <p className="text-sm text-muted-foreground">Intelligent question generation using advanced language models</p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">Multi-Format</div>
            <p className="text-sm text-muted-foreground">Support for PDFs, Word documents, and text files</p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">Instant</div>
            <p className="text-sm text-muted-foreground">Generate and take quizzes in seconds, not hours</p>
          </div>
        </div>
      </div>
      </PageLayout>
    </div>
  );
}
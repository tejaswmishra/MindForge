'use client';

import { useEffect, useState } from 'react';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { StatsCards } from '@/components/analytics/StatsCards';
import { TopicChart } from '@/components/analytics/TopicChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from '@/components/Navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface DashboardData {
  stats: {
    totalSyllabi: number;
    totalQuizzes: number;
    averageScore: number;
    totalQuestions: number;
  };
  recentQuizzes: Array<{
    id: string;
    title: string;
    score?: number;
    created_at: string;
  }>;
  performanceByTopic: Array<{
    topic: string;
    accuracy: number;
    questionsAttempted: number;
  }>;
  performanceOverTime: Array<{
    date: string;
    accuracy: number;
    quizzesAttempted: number;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/analytics');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout showBreadcrumb>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout showBreadcrumb>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto p-6">
          <Card className="border-red-200 bg-red-50/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                Error Loading Dashboard
              </CardTitle>
              <CardDescription className="text-red-600">
                Failed to load your dashboard data. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBreadcrumb>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight">
                Dashboard
              </h1>
              <p className="text-blue-100 text-lg">
                Track your learning progress and performance across all subjects
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-medium">
              Welcome back!
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="-mt-16 relative z-10">
          <StatsCards stats={data.stats} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                📈 Performance Over Time
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your quiz accuracy and participation trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={data.performanceOverTime} />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                🎯 Topic Performance
              </CardTitle>
              <CardDescription className="text-gray-600">
                Accuracy breakdown by subject areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopicChart data={data.performanceByTopic} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Quizzes */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              📊 Recent Quizzes
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your latest quiz attempts and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Quiz Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Score</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentQuizzes.length > 0 ? (
                  data.recentQuizzes.map((quiz) => (
                    <TableRow key={quiz.id} className="border-gray-100 hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900">{quiz.title}</TableCell>
                      <TableCell>
                        {quiz.score !== undefined ? (
                          <Badge 
                            className={`font-medium ${
                              quiz.score >= 80 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : quiz.score >= 60 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {quiz.score}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                            Not taken
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(quiz.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <a href={`/quiz/${quiz.id}`}>
                            {quiz.score !== undefined ? 'Review' : 'Take Quiz'}
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="space-y-3">
                        <div className="text-6xl">📚</div>
                        <div className="text-gray-600 font-medium">No quizzes available yet</div>
                        <div className="text-sm text-gray-500">Upload a syllabus to get started!</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              🚀 Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Get started with your next learning session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Button asChild size="lg" className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                <a href="/test" className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div className="text-left">
                    <div className="font-semibold">Upload Syllabus</div>
                    <div className="text-xs text-blue-100">Add new materials</div>
                  </div>
                </a>
              </Button>
              
              <Button asChild size="lg" className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                <a href="/test" className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <div className="text-left">
                    <div className="font-semibold">Generate Quiz</div>
                    <div className="text-xs text-purple-100">Create AI quizzes</div>
                  </div>
                </a>
              </Button>
              
              <Button asChild size="lg" className="h-16 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                <a href="/quiz" className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <div className="font-semibold">View Results</div>
                    <div className="text-xs text-teal-100">Check progress</div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageLayout>
  );
}
'use client';

import { PageLayout } from '@/components/Navigation';
import { FlashcardGenerator } from '@/components/flashcards/FlashcardGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

export default function FlashcardsPage() {
  const [stats, setStats] = useState({ total: 0, dueToday: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/flashcards');
      const data = await response.json();
      if (data.success) {
        const dueToday = data.flashcards.filter((card: any) => 
          new Date(card.next_due) <= new Date()
        ).length;
        setStats({ total: data.total, dueToday });
      }
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    }
  };

  return (
    <PageLayout showBreadcrumb>
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight">
                Flashcards
              </h1>
              <p className="text-purple-100 text-lg">
                Study smarter with AI-generated flashcards and spaced repetition
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs">Total Cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{stats.total}</div>
                <div className="text-blue-100">Total Flashcards</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{stats.dueToday}</div>
                <div className="text-green-100">Due Today</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
            <CardContent className="pt-6 flex items-center justify-center">
              <Button 
                asChild
                size="lg" 
                variant="secondary"
                className="w-full bg-white text-purple-600 hover:bg-purple-50"
              >
                <a href="/flashcards/study">
                  🚀 Start Studying
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generator */}
        <FlashcardGenerator />

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-white via-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>How Flashcards Work</CardTitle>
            <CardDescription>Powered by spaced repetition for optimal learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-2xl">📚</div>
                <h3 className="font-semibold">AI Generation</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes your materials and creates focused, high-quality flashcards
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🔄</div>
                <h3 className="font-semibold">Spaced Repetition</h3>
                <p className="text-sm text-muted-foreground">
                  Cards appear at optimal intervals based on how well you know them
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">📊</div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your learning with detailed statistics and insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
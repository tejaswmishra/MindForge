'use client';

import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/Navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic?: string;
  last_studied?: string;
  next_due?: string;
  interval_days?: number;
  ease_factor?: number;
  repetition?: number;
}

export default function FlashcardStudyPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ studied: 0, total: 0 });

  useEffect(() => {
    fetchDueFlashcards();
  }, []);

  const fetchDueFlashcards = async () => {
    try {
      const response = await fetch('/api/flashcards?dueOnly=true');
      const data = await response.json();
      
      if (data.success && data.flashcards.length > 0) {
        // Shuffle flashcards for better learning
        const shuffled = data.flashcards.sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setStats({ studied: 0, total: shuffled.length });
      } else {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (quality: number) => {
    const currentCard = flashcards[currentIndex];
    
    try {
      const response = await fetch(`/api/flashcards/${currentCard.id}/study`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality })
      });

      const data = await response.json();
      
      if (data.success) {
        // Move to next card
        const newStudied = stats.studied + 1;
        setStats({ ...stats, studied: newStudied });
        
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        } else {
          setSessionComplete(true);
        }
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setStats({ studied: 0, total: flashcards.length });
  };

  if (loading) {
    return (
      <PageLayout showBreadcrumb>
        <div className="max-w-4xl mx-auto p-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (sessionComplete || flashcards.length === 0) {
    return (
      <PageLayout showBreadcrumb>
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-5xl font-bold mb-4">
                {stats.studied > 0 ? 'Session Complete!' : 'All Caught Up!'}
              </h1>
              <p className="text-green-100 text-lg">
                {stats.studied > 0 
                  ? `You studied ${stats.studied} flashcards. Great work!`
                  : 'No flashcards are due for review right now.'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                {stats.studied > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-green-700">{stats.studied}</div>
                      <div className="text-sm text-green-600">Cards Studied</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-blue-700">100%</div>
                      <div className="text-sm text-blue-600">Completion</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-purple-700">
                        {Math.floor(stats.studied * 0.5)}min
                      </div>
                      <div className="text-sm text-purple-600">Time Spent</div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">What's next?</h3>
                  <p className="text-muted-foreground">
                    Continue your learning journey or take a break
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button asChild size="lg">
                    <a href="/flashcards">View All Flashcards</a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="/dashboard">Back to Dashboard</a>
                  </Button>
                  {stats.studied > 0 && (
                    <Button onClick={resetSession} variant="secondary" size="lg">
                      Study Again
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <PageLayout showBreadcrumb>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Study Session</h1>
              <p className="text-purple-100">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-2 bg-white text-purple-600">
              {stats.studied}/{stats.total} studied
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mt-4 bg-white/20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Topic Badge */}
        {currentCard.topic && (
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {currentCard.topic}
            </Badge>
          </div>
        )}

        {/* Flashcard */}
        <div 
          className="relative h-96 cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Card className={`h-full transition-all duration-500 transform ${
            isFlipped ? 'rotate-y-180' : ''
          } preserve-3d shadow-2xl hover:shadow-3xl`}>
            <CardContent className="h-full flex items-center justify-center p-12">
              <div className={`text-center ${isFlipped ? 'rotate-y-180' : ''}`}>
                {!isFlipped ? (
                  <div>
                    <div className="text-sm text-muted-foreground mb-4">Question</div>
                    <h2 className="text-3xl font-bold mb-8">
                      {currentCard.front}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Click to reveal answer
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-muted-foreground mb-4">Answer</div>
                    <p className="text-2xl leading-relaxed">
                      {currentCard.back}
                    </p>
                    <p className="text-sm text-muted-foreground mt-8">
                      Rate your confidence below
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Buttons */}
        {isFlipped && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <p className="text-center text-sm text-muted-foreground mb-4">
              How well did you know this?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => handleRating(0)}
                variant="outline"
                size="lg"
                className="h-20 flex flex-col gap-2 bg-red-50 hover:bg-red-100 border-red-200"
              >
                <span className="text-2xl">😰</span>
                <span className="text-sm font-medium">Again</span>
                <span className="text-xs text-muted-foreground">1 day</span>
              </Button>

              <Button
                onClick={() => handleRating(3)}
                variant="outline"
                size="lg"
                className="h-20 flex flex-col gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
              >
                <span className="text-2xl">🤔</span>
                <span className="text-sm font-medium">Hard</span>
                <span className="text-xs text-muted-foreground">3 days</span>
              </Button>

              <Button
                onClick={() => handleRating(4)}
                variant="outline"
                size="lg"
                className="h-20 flex flex-col gap-2 bg-green-50 hover:bg-green-100 border-green-200"
              >
                <span className="text-2xl">🙂</span>
                <span className="text-sm font-medium">Good</span>
                <span className="text-xs text-muted-foreground">6 days</span>
              </Button>

              <Button
                onClick={() => handleRating(5)}
                variant="outline"
                size="lg"
                className="h-20 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <span className="text-2xl">😄</span>
                <span className="text-sm font-medium">Easy</span>
                <span className="text-xs text-muted-foreground">10+ days</span>
              </Button>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>💡 Tip: Click the card to flip it</p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </PageLayout>
  );
}
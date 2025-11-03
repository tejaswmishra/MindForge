// src/components/flashcards/FlashcardGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

interface Syllabus {
  id: string;
  title: string;
  subject: string | null;
}

export function FlashcardGenerator() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState('');
  const [numCards, setNumCards] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loadingSyllabi, setLoadingSyllabi] = useState(true);

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = async () => {
    try {
      const response = await fetch('/api/syllabi');
      const data = await response.json();
      if (data.success) {
        setSyllabi(data.syllabi);
      }
    } catch (err) {
      console.error('Error fetching syllabi:', err);
    } finally {
      setLoadingSyllabi(false);
    }
  };

  const generateFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSyllabus) return;

    setIsGenerating(true);
    setError('');
    setResult(null);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return 80;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const response = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusId: selectedSyllabus,
          numCards
        }),
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      if (data.success) {
        setResult(data);
        setTimeout(() => setGenerationProgress(0), 2000);
      } else {
        setError(data.error);
        setGenerationProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Failed to generate flashcards. Please try again.');
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError('');
    setGenerationProgress(0);
  };

  if (loadingSyllabi) {
    return <Card><CardContent className="p-8">Loading syllabi...</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      {!result && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎴 Generate Flashcards
            </CardTitle>
            <CardDescription>
              Create study flashcards with spaced repetition from your course materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateFlashcards} className="space-y-6">
              {/* Syllabus Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Select Course Material</Label>
                {syllabi.length === 0 ? (
                  <Card className="border-dashed border-muted-foreground/25">
                    <CardContent className="flex items-center justify-center py-8 text-center">
                      <div>
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-muted-foreground mb-2">No course materials uploaded yet</p>
                        <p className="text-sm text-muted-foreground">Upload a syllabus first to generate flashcards</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Select value={selectedSyllabus} onValueChange={setSelectedSyllabus}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a course material..." />
                    </SelectTrigger>
                    <SelectContent>
                      {syllabi.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <span>{s.title}</span>
                            {s.subject && (
                              <Badge variant="secondary" className="text-xs">
                                {s.subject}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Number of Cards */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Number of Flashcards</Label>
                <Select value={numCards.toString()} onValueChange={(value) => setNumCards(Number(value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Flashcards</SelectItem>
                    <SelectItem value="10">10 Flashcards</SelectItem>
                    <SelectItem value="15">15 Flashcards</SelectItem>
                    <SelectItem value="20">20 Flashcards</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generation Progress */}
              {isGenerating && generationProgress > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Generating flashcards...
                    </span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    AI is analyzing your content and creating study cards
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                type="submit"
                disabled={isGenerating || !selectedSyllabus || syllabi.length === 0}
                className="w-full h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    ✨ Generate Flashcards
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-medium">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {result && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              🎉 Flashcards Generated!
            </CardTitle>
            <CardDescription>
              Your flashcards are ready for study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/80 p-4 rounded-md">
                <p className="font-semibold mb-2">Generated: {result.flashcards.length} flashcards</p>
                <p className="text-sm text-muted-foreground">{result.message}</p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  asChild
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <a href="/flashcards/study">
                    🚀 Start Studying
                  </a>
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1"
                >
                  Generate More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
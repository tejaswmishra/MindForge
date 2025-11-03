'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Syllabus {
  id: string;
  title: string;
  subject: string | null;
}

export function QuizGenerator() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('mixed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loadingSyllabi, setLoadingSyllabi] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);

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

  const getDifficultyInfo = (level: string) => {
    const info = {
      mixed: { 
        icon: '🎯', 
        color: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
        description: 'Balanced mix of all difficulty levels'
      },
      easy: { 
        icon: '🟢', 
        color: 'bg-green-100 text-green-700 border-green-200',
        description: 'Fundamental concepts and basic questions'
      },
      medium: { 
        icon: '🟡', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        description: 'Moderate complexity with some analysis'
      },
      hard: { 
        icon: '🔴', 
        color: 'bg-red-100 text-red-700 border-red-200',
        description: 'Advanced concepts and critical thinking'
      }
    };
    return info[level as keyof typeof info] || info.mixed;
  };

  const generateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSyllabus) return;

    setIsGenerating(true);
    setError('');
    setResult(null);
    setGenerationProgress(0);

    // Simulate progress for better UX
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
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusId: selectedSyllabus,
          numQuestions,
          difficulty,
        }),
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      if (data.success) {
        setResult(data.quiz);
        setTimeout(() => setGenerationProgress(0), 2000);
      } else {
        setError(data.error);
        setGenerationProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Failed to generate quiz. Please try again.');
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
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧠 Generate AI Quiz
            </CardTitle>
            <CardDescription>
              Create personalized quizzes from your uploaded materials using advanced AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateQuiz} className="space-y-6">
              {/* Syllabus Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Select Course Material</Label>
                {syllabi.length === 0 ? (
                  <Card className="border-dashed border-muted-foreground/25">
                    <CardContent className="flex items-center justify-center py-8 text-center">
                      <div>
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-muted-foreground mb-2">No course materials uploaded yet</p>
                        <p className="text-sm text-muted-foreground">Upload a syllabus first to generate quizzes</p>
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

              {/* Quiz Configuration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Questions */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Number of Questions</Label>
                  <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(Number(value))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">
                        <div className="flex items-center gap-2">
                          <span>5 Questions</span>
                          <Badge variant="outline" className="text-xs">Quick</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="10">
                        <div className="flex items-center gap-2">
                          <span>10 Questions</span>
                          <Badge variant="outline" className="text-xs">Standard</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="15">
                        <div className="flex items-center gap-2">
                          <span>15 Questions</span>
                          <Badge variant="outline" className="text-xs">Extended</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="20">
                        <div className="flex items-center gap-2">
                          <span>20 Questions</span>
                          <Badge variant="outline" className="text-xs">Comprehensive</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['mixed', 'easy', 'medium', 'hard'].map((level) => {
                        const info = getDifficultyInfo(level);
                        return (
                          <SelectItem key={level} value={level}>
                            <div className="flex items-center gap-2">
                              <span>{info.icon}</span>
                              <span className="capitalize">{level === 'mixed' ? 'Mixed Difficulty' : level}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground">
                    {getDifficultyInfo(difficulty).description}
                  </div>
                </div>
              </div>

              {/* Quiz Settings Preview */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Quiz Preview:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {numQuestions} Questions
                  </Badge>
                  <Badge className={getDifficultyInfo(difficulty).color}>
                    {getDifficultyInfo(difficulty).icon} {difficulty === 'mixed' ? 'Mixed Difficulty' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    MCQ + True/False + Short Answer
                  </Badge>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && generationProgress > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Generating your quiz...
                    </span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    AI is analyzing your content and creating personalized questions
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
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    ✨ Generate AI Quiz
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
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
              🎉 Quiz Generated Successfully!
            </CardTitle>
            <CardDescription>
              Your personalized quiz is ready. Start practicing now!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-background/80 p-3 rounded-md">
                  <p className="font-medium text-muted-foreground">Title:</p>
                  <p className="font-semibold">{result.title}</p>
                </div>
                <div className="bg-background/80 p-3 rounded-md">
                  <p className="font-medium text-muted-foreground">Questions:</p>
                  <p className="font-semibold">{result.questions?.length || numQuestions}</p>
                </div>
                <div className="bg-background/80 p-3 rounded-md">
                  <p className="font-medium text-muted-foreground">Quiz ID:</p>
                  <p className="font-mono text-xs">{result.id}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  asChild
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <a href={`/quiz/${result.id}`}>
                    🚀 Take Quiz Now
                  </a>
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1"
                >
                  Generate Another
                </Button>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Ready to test your knowledge!
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
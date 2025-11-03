'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  id: string;
  type: 'MCQ' | 'TF' | 'SHORT';
  question: string;
  options: string[] | null;
  difficulty: string;
  topic: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      const data = await response.json();
      
      if (data.success) {
        setQuiz(data.quiz);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [quiz!.questions[currentQuestion].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const responses = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: questionId,
      user_answer: answer,
      time_taken: Math.floor((Date.now() - startTime) / 1000 / quiz!.questions.length),
    }));

    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          totalTime: Math.floor((Date.now() - startTime) / 1000),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': 
        return 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'medium': 
        return 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'hard': 
        return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default: 
        return 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Quiz Error</CardTitle>
              <CardDescription>Something went wrong loading your quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-16">
              <h2 className="text-xl font-semibold mb-2">Quiz Not Found</h2>
              <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist</p>
              <Button asChild>
                <a href="/dashboard">Back to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Page
  if (results) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 border border-primary/20">
                  <span className="text-4xl font-bold text-primary">{results.score}%</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xl">
                    <span className="font-semibold text-primary">{results.correct}</span> out of{' '}
                    <span className="font-semibold">{results.total}</span> correct
                  </p>
                  <p className="text-muted-foreground">
                    Completed in {formatTime(results.totalTime)}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-sm">
                    {results.score >= 80 ? '🎉 Excellent!' : results.score >= 60 ? '👍 Good job!' : '💪 Keep practicing!'}
                  </Badge>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {results.responses.map((response: any, index: number) => (
                  <Card 
                    key={response.question_id}
                    className={`transition-all ${
                      response.is_correct 
                        ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30' 
                        : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30'
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          response.is_correct 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}>
                          {response.is_correct ? '✓' : '✗'}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="font-medium text-foreground">{index + 1}. {response.question}</p>
                          
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium">Your answer:</span>{' '}
                              <span className={response.is_correct ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                {response.user_answer}
                              </span>
                            </p>
                            
                            {!response.is_correct && (
                              <p className="text-muted-foreground">
                                <span className="font-medium">Correct answer:</span>{' '}
                                <span className="text-green-700 dark:text-green-400">{response.correct_answer}</span>
                              </p>
                            )}
                          </div>

                          {response.explanation && (
                            <div className="bg-muted/50 dark:bg-muted/30 p-3 rounded-md text-sm border">
                              <span className="font-medium">Explanation:</span> 
                              <span className="text-muted-foreground ml-1">{response.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <Button asChild variant="outline">
                  <a href="/dashboard">Dashboard</a>
                </Button>
                <Button asChild>
                  <a href="/test">Generate Another Quiz</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz Taking Interface
  const question = quiz.questions[currentQuestion];
  const currentAnswer = answers[question.id] || '';
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <div className="border-b bg-card/50 dark:bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1 bg-background/50">
                ⏱️ {formatTime(timeElapsed)}
              </Badge>
              <Badge variant="secondary">
                {answeredCount}/{quiz.questions.length} answered
              </Badge>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl leading-relaxed text-foreground">
                {question.question}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                <Badge variant="secondary" className="bg-secondary/80">{question.topic}</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* MCQ Options */}
            {question.type === 'MCQ' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label 
                    key={index} 
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm ${
                      currentAnswer === option 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                        : 'border-border hover:border-primary/50 dark:border-muted-foreground/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={currentAnswer === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-4 h-4 text-primary border-muted-foreground"
                    />
                    <span className="ml-3 text-sm text-foreground">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False Options */}
            {question.type === 'TF' && (
              <div className="grid grid-cols-2 gap-4">
                {['True', 'False'].map((option) => (
                  <label 
                    key={option}
                    className={`flex items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm ${
                      currentAnswer === option 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                        : 'border-border hover:border-primary/50 dark:border-muted-foreground/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={currentAnswer === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">{option === 'True' ? '✅' : '❌'}</div>
                      <span className="font-medium text-foreground">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {question.type === 'SHORT' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Answer:</label>
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[120px] resize-none bg-background dark:bg-muted/20 border-border"
                />
                <p className="text-xs text-muted-foreground">
                  {currentAnswer.length} characters
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
          >
            ← Previous
          </Button>

          <div className="flex gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all border ${
                  index === currentQuestion
                    ? 'bg-primary text-primary-foreground border-primary'
                    : answers[quiz.questions[index].id]
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border-border'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="lg"
                  disabled={answeredCount === 0}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                >
                  Submit Quiz →
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Submit Quiz?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    You have answered {answeredCount} out of {quiz.questions.length} questions.
                    {answeredCount < quiz.questions.length && (
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        {' '}Unanswered questions will be marked as incorrect.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Review Answers
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              size="lg"
            >
              Next →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
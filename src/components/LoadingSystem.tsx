'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Loading States for Different Components
export function DashboardLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-16" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function QuizLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function FormLoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="flex items-center space-x-4">
            <Skeleton className="flex-1 h-px" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="flex-1 h-px" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="text-center">
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Progress Loading Component
interface ProgressLoadingProps {
  progress: number;
  text?: string;
  subtext?: string;
  className?: string;
}

export function ProgressLoading({ progress, text, subtext, className = '' }: ProgressLoadingProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {text && (
        <div className="text-center space-y-1">
          <h3 className="font-medium">{text}</h3>
          {subtext && (
            <p className="text-sm text-muted-foreground">{subtext}</p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

// Page Loading Wrapper
interface PageLoadingWrapperProps {
  loading: boolean;
  error?: string | null;
  loadingSkeleton?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLoadingWrapper({ 
  loading, 
  error, 
  loadingSkeleton, 
  children 
}: PageLoadingWrapperProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {loadingSkeleton || <LoadingSpinner size="lg" text="Loading..." className="min-h-[50vh]" />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <h3 className="font-medium text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Async operation loading hook
// Fix for the useAsyncLoading hook in LoadingSystem.tsx
export function useAsyncLoading<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Move loadData outside useEffect so it can be referenced in return
  const loadData = React.useCallback(async () => {
    let cancelled = false;
    
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      
      if (!cancelled) {
        setData(result);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
    
    return () => {
      cancelled = true;
    };
  }, [asyncFn]);

  React.useEffect(() => {
    loadData();
  }, deps);

  return { data, loading, error, refetch: loadData };
}
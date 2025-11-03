'use client';

import { SignIn, SignUp } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

function AuthLoadingSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-3">
          <div className="h-8 bg-gray-200 rounded-lg mx-auto w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-64 animate-pulse"></div>
        </div>
        
        {/* Social buttons skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Divider skeleton */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 h-px bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex-1 h-px bg-gray-200 animate-pulse"></div>
        </div>
        
        {/* Form fields skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-12 bg-blue-200 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded mx-auto w-40 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Sign In Page
export function SignInPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate auth component loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Mind Forge</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Home
              </a>
              <a href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue your learning journey with AI-powered quizzes
            </p>
          </div>

          {/* Auth Component Container with Loading State */}
          <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {isLoaded ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "mx-auto",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-2xl font-bold text-gray-900",
                      headerSubtitle: "text-gray-600",
                      socialButtonsBlockButton: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200",
                      formFieldInput: "border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                      footerActionLink: "text-blue-600 hover:text-blue-700 font-medium"
                    }
                  }}
                />
              </div>
            ) : (
              <AuthLoadingSkeleton />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Transform your study materials into personalized quizzes with AI
            </p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

// Sign Up Page
export function SignUpPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate auth component loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Mind Forge</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Home
              </a>
              <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Start Learning Today
            </h1>
            <p className="text-gray-600 text-lg">
              Create your account and transform your study materials into AI-powered quizzes
            </p>
          </div>

          {/* Auth Component Container with Loading State */}
          <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {isLoaded ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "mx-auto",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-2xl font-bold text-gray-900",
                      headerSubtitle: "text-gray-600",
                      socialButtonsBlockButton: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200",
                      formFieldInput: "border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                      footerActionLink: "text-blue-600 hover:text-blue-700 font-medium"
                    }
                  }}
                />
              </div>
            ) : (
              <AuthLoadingSkeleton />
            )}
          </div>

          {/* Features - only show when loaded */}
          <div className={`mt-8 space-y-3 transition-opacity duration-500 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-center font-semibold text-gray-900 mb-4">What you'll get:</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🤖</span>
                </div>
                <span>AI-powered quiz generation from your materials</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📊</span>
                </div>
                <span>Detailed analytics and progress tracking</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">⚡</span>
                </div>
                <span>Instant feedback and explanations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
export default SignInPage; 

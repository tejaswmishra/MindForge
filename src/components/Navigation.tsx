'use client';

import { useUser, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

interface NavigationProps {
  variant?: 'default' | 'transparent' | 'solid';
  showBreadcrumb?: boolean;
}

export function Navigation({ variant = 'default', showBreadcrumb = false }: NavigationProps) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Upload', href: '/test', icon: '📚' },
    { name: 'Flashcards', href: '/flashcards', icon: '🎴' },
  ];

  const getNavStyle = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm';
      case 'solid':
        return 'bg-white border-b border-gray-200 shadow-sm';
      default:
        return 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm';
    }
  };

  const getBreadcrumb = () => {
    const pathMap: Record<string, string> = {
      '/': 'Home',
      '/dashboard': 'Dashboard',
      '/test': 'Upload & Generate',
      '/quiz': 'Quiz',
      '/sign-in': 'Sign In',
      '/sign-up': 'Sign Up',
    };

    // Handle dynamic routes like /quiz/[id]
    if (pathname.startsWith('/quiz/') && pathname !== '/quiz') {
      return 'Take Quiz';
    }

    return pathMap[pathname] || 'Page';
  };

  return (
    <nav className={`sticky top-0 z-50 ${getNavStyle()}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Mind Forge</span>
          </a>

          {/* Center Navigation - Desktop Only */}
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href === '/test' && pathname.startsWith('/test')) ||
                  (item.href === '/dashboard' && pathname === '/dashboard');
                
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className={`flex items-center gap-2 ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <a href={item.href}>
                      {item.icon && <span className="text-sm">{item.icon}</span>}
                      {item.name}
                    </a>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                {/* User Info - Desktop Only */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                      <span className="sr-only md:not-sr-only text-gray-600">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                      {navItems.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <a href={item.href} className="flex items-center gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            {item.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </div>

                    <DropdownMenuItem asChild>
                      <a href="/dashboard" className="flex items-center gap-2">
                        📊 Dashboard
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/test" className="flex items-center gap-2">
                        📚 Upload Materials
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild>
                  <a href="/sign-in">Sign In</a>
                </Button>
                <Button asChild>
                  <a href="/sign-up">Get Started</a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb - Optional */}
        {showBreadcrumb && isSignedIn && (
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900 transition-colors">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{getBreadcrumb()}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Layout wrapper component for consistent page structure
interface PageLayoutProps {
  children: React.ReactNode;
  navigationVariant?: 'default' | 'transparent' | 'solid';
  showBreadcrumb?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  navigationVariant = 'default', 
  showBreadcrumb = false,
  className = "" 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation variant={navigationVariant} showBreadcrumb={showBreadcrumb} />
      <main className={className}>
        {children}
      </main>
    </div>
  );
}
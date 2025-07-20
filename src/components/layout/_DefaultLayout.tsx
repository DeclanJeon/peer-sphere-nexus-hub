// src/components/Layout.tsx
import { ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Store, 
  User, 
  ShoppingBag, 
  MessageCircle, 
  Calendar,
  QrCode,
  LogOut,
  Menu,
  Plus,
  Settings,
  FileText,
  Star,
  Package,
  LogIn
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const navigation = [
    // { name: '홈', href: '/', icon: Home },
    // { name: '피어몰', href: '/peermalls', icon: Store },
    // { name: '제품', href: '/products', icon: ShoppingBag },
    // { name: '커뮤니티', href: '/community', icon: MessageCircle },
    // { name: '이벤트', href: '/events', icon: Calendar },
  ];

  // 인증된 사용자만 볼 수 있는 메뉴
  const authenticatedNavigation = [
    // { name: 'QR코드', href: '/qr', icon: QrCode },
    // { name: '마이페이지', href: '/mypage', icon: User },
  ];

  // 전체 네비게이션 (인증 상태에 따라 동적으로 구성)
  const fullNavigation = isAuthenticated 
    ? [...navigation, ...authenticatedNavigation]
    : navigation;

  // 로딩 중일 때 표시할 스켈레톤
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                피어몰
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {fullNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* 피어몰 생성 버튼 */}
                  <Button variant="default" size="sm" asChild>
                    <Link to="/peermalls/create">
                      <Plus className="h-4 w-4 mr-2" />
                      피어몰 생성
                    </Link>
                  </Button>

                  {/* 프로필 드롭다운 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profile_image} alt={user?.name || '프로필'} />
                          <AvatarFallback>
                            {user?.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user?.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/info" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>내 정보 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/mall" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 피어몰 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/products" className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          <span>내 제품 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/reviews" className="flex items-center">
                          <Star className="mr-2 h-4 w-4" />
                          <span>내 리뷰 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/posts" className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>내 게시글 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* 로그인 버튼 */}
                  <Button variant="default" size="sm" asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      로그인
                    </Link>
                  </Button>
                </>
              )}
              
              {/* Mobile menu button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {fullNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.href
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* 모바일 메뉴 구분선 */}
              {isAuthenticated && (
                <>
                  <div className="border-t my-2" />
                  <Link
                    to="/peermalls/create"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-primary bg-primary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="h-5 w-5" />
                    <span>피어몰 생성</span>
                  </Link>
                  <div className="border-t my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>로그아웃</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <div className="border-t my-2" />
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-primary bg-primary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>로그인</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 피어몰. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
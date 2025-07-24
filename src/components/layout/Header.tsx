import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Home, Store, User, ShoppingBag, MessageCircle, Calendar,
  LogOut, Menu, Plus, Settings, Star, Package, LogIn
} from 'lucide-react';

// --- 데이터 상수화 영역 ---
// 컴포넌트 로직과 데이터를 분리하여 가독성 및 유지보수성 향상

// 1. 메인 네비게이션 메뉴 데이터
const mainNavItems = [
  // { name: '홈', href: '/', icon: Home },
  // { name: '피어몰', href: '/peermalls', icon: Store },
  // { name: '제품', href: '/products', icon: ShoppingBag },
  // { name: '커뮤니티', href: '/community', icon: MessageCircle },
  // { name: '이벤트', href: '/events', icon: Calendar },
];

// 2. 프로필 드롭다운 메뉴 데이터 (아이콘 수정 및 데이터 기반으로 변경)
const profileDropdownItems = [
  { href: "/mypage/manage/profile", icon: Settings, label: "내 정보 관리" },
  { href: "/mypage/manage/peermall", icon: Store, label: "내 피어몰 관리" },
  { href: "/mypage/manage/products", icon: Package, label: "내 상품 관리" },
  { href: "/mypage/manage/reviews", icon: Star, label: "내 리뷰 관리" },
  { href: "/mypage/manage/community", icon: MessageCircle, label: "내 게시글 관리" },
  { href: "/mypage/manage/events", icon: Calendar, label: "내 이벤트 관리" },
];


// --- 메인 Header 컴포넌트 ---

const Header = () => {
  // --- 훅 및 상태 관리 영역 ---
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- 핸들러 함수 영역 ---
  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false); // 로그아웃 시 모바일 메뉴 닫기
  };

  // --- 렌더링 영역 ---
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. 로고 */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              피어몰
            </Link>
          </div>
          
          {/* 2. 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
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

          {/* 3. 사용자 액션 (인증 상태에 따라 분기) */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Button variant="default" size="sm" asChild>
                  <Link to="/peermalls/create">
                    <Plus className="h-4 w-4 mr-2" />
                    피어몰 생성
                  </Link>
                </Button>

                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>

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
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                      {user?.email}
                    </div>
                    <DropdownMenuSeparator />
                    {/* 드롭다운 메뉴 아이템을 map으로 동적 생성 */}
                    {profileDropdownItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem asChild key={item.href}>
                          <Link to={item.href} className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  로그인
                </Link>
              </Button>
            )}
            
            {/* 4. 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="메뉴 토글"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 모바일 네비게이션 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
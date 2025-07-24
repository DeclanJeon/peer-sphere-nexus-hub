// src/components/layout/UserPeermallHeader.tsx

import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// UI Components & Icons
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Home, Store, User, ShoppingBag, MessageCircle, Calendar,
  LogOut, Menu, Settings, LogIn, Plus, Package, Star
} from 'lucide-react';
import ProductModal from '@/components/common/product/ProductModal';
import { Peermall } from '@/types/peermall';

// ✨ 프로필 드롭다운 메뉴 데이터
const profileDropdownItems = [
  { href: "/mypage/manage/profile", icon: Settings, label: "내 정보 관리" },
  { href: "/mypage/manage/peermall", icon: Store, label: "내 피어몰 관리" },
  { href: "/mypage/manage/products", icon: Package, label: "내 상품 관리" },
  { href: "/mypage/manage/reviews", icon: Star, label: "내 리뷰 관리" },
  { href: "/mypage/manage/community", icon: MessageCircle, label: "내 게시글 관리" },
  { href: "/mypage/manage/events", icon: Calendar, label: "내 이벤트 관리" },
];

interface UserHeaderProps {
  currentPeermall: Peermall | null;
}

const UserHeader = ({ currentPeermall }: UserHeaderProps) => {
  // 1. 상태(State)와 훅(Hook) 선언
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // 2. 로직 및 핸들러 정의
  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const handleProductCreateSuccess = () => {
    if (currentPeermall?.url) {
      navigate(`/home/${currentPeermall.url}/products`);
    }
    setIsProductModalOpen(false);
  };

  // 3. 동적 데이터 생성 (useMemo로 최적화)
  const navigation = useMemo(() => {
    const peermallAddress = currentPeermall?.url || '';
    if (!peermallAddress) return [];
    return [
    //   { name: '홈', href: `/home/${peermallAddress}`, icon: Home },
    //   { name: '제품', href: `/home/${peermallAddress}/products`, icon: ShoppingBag },
    //   { name: '커뮤니티', href: `/home/${peermallAddress}/community`, icon: MessageCircle },
    //   { name: '이벤트', href: `/home/${peermallAddress}/events`, icon: Calendar },
    ];
  }, [currentPeermall?.url]);

  // ✨ 소유자 확인 로직 (로그인 + 이메일 매칭)
  const isOwner = useMemo(() => {
    // 로그인하지 않았으면 false
    if (!isAuthenticated || !user || !currentPeermall) {
      return false;
    }
    
    // 이메일 비교 (대소문자 구분 없이)
    const ownerEmail = currentPeermall.owner_email?.toLowerCase();
    const userEmail = user.user_email?.toLowerCase();
    
    return ownerEmail === userEmail;
  }, [isAuthenticated, currentPeermall, user]);

  // 디버깅용 로그
  console.log('🔍 소유자 확인:', {
    isOwner,
    isAuthenticated,
    currentPeermall_owner: currentPeermall?.owner_email,
    user_email: user?.user_email,
  });

  // 4. UI 렌더링
  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 피어몰 로고 및 정보 */}
            <div className="flex items-center space-x-4">
              <Link to={`/home/${currentPeermall?.url}`} className="flex-shrink-0">
                {currentPeermall?.imageUrl || currentPeermall?.image_url ? (
                  <img 
                    className="h-12 w-12 rounded-full object-cover" 
                    src={currentPeermall.imageUrl || currentPeermall.image_url} 
                    alt={currentPeermall.name} 
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Store className="text-muted-foreground" />
                  </div>
                )}
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{currentPeermall?.name}</h1>
                <p className="text-sm text-gray-500">{currentPeermall?.familyCompany}</p>
              </div>
            </div>

            {/* 데스크탑 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 사용자 액션 버튼 */}
            <div className="flex items-center space-x-4">
              {/* ✨ 제품 등록 버튼 - 로그인 + 소유자일 때만 표시 */}
              {isAuthenticated && isOwner && (
                <Button 
                  size="sm" 
                  onClick={() => setIsProductModalOpen(true)} 
                  className="hidden md:flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> 
                  제품 등록
                </Button>
              )}

              <div className="hidden md:block">
                {isAuthenticated ? (
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
                      {/* ✨ 드롭다운 내 제품 등록 - 소유자일 때만 표시 */}
                      {isOwner && (
                        <>
                          <DropdownMenuItem onClick={() => setIsProductModalOpen(true)}>
                            <Package className="mr-2 h-4 w-4" />
                            <span>제품 등록</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {/* 프로필 메뉴 아이템들 */}
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
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      로그인
                    </Link>
                  </Button>
                )}
              </div>
              
              {/* 모바일 메뉴 버튼 */}
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="border-t my-2"></div>
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="text-sm font-medium mb-2">{user?.email}</div>
                  {/* ✨ 모바일 제품 등록 - 소유자일 때만 표시 */}
                  {isOwner && (
                    <button 
                      onClick={() => { 
                        setIsProductModalOpen(true); 
                        setIsMobileMenuOpen(false); 
                      }}
                      className="flex items-center w-full text-left py-2 text-muted-foreground hover:text-primary"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <span>제품 등록</span>
                    </button>
                  )}
                  {/* 모바일 프로필 메뉴 */}
                  {profileDropdownItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.href}
                        to={item.href} 
                        className="flex items-center w-full text-left py-2 text-muted-foreground hover:text-primary" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full text-left py-2 text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <Button size="sm" asChild className="w-full justify-start">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    로그인
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 제품 등록 모달 */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={handleProductCreateSuccess}
        mode="create"
      />
    </>
  );
};

export default UserHeader;

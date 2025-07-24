
import { ReactNode, useState } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
              {navigation.map((item) => {
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

                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
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
                        <Link to="/mypage/manage/profile" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>내 정보 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/manage/peermall" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 피어몰 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/manage/products" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 제품 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/manage/products/reviews" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 제품 리뷰 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/manage/community" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 게시글 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/manage/community/comments" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 게시글 댓글 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage/manage/events" className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>내 이벤트 관리</span>
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
                <Button variant="default" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    로그인
                  </Link>
                </Button>
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
              {navigation.map((item) => {
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

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 피어몰 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">피어몰</h3>
              <p className="text-sm text-gray-600">
                세상을 넓히는 연결의 시작,<br />
                피어몰과 함께 하세요.
              </p>
              {/* <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.415-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.415-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div> */}
            </div>

            {/* 사업자 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">사업자 정보</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>피어테라㈜ | 대표이사: 김기환</p>
                <p>선유로13길 25, 에이스하이테크시티2 408호</p>
                <p>사업자 등록번호: 110-00-00000</p>
                <p>통신판매업신고: 2017-서울송파-0680</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">대표 이메일</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>info@peermall.com</p>
              </div>
            </div>


            {/* 고객센터 */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">고객센터</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">고객센터: <a href="/contact" className="text-primary hover:underline">연락하기</a></p>
                <p>운영시간: 평일 09:00 ~ 18:00</p>
                <p>(점심시간 12:00 ~ 13:00)</p>
                <p>주말 및 공휴일 휴무</p>
              </div>
              <div className="pt-2">
                <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">개인정보처리방침</a>
                <span className="mx-2 text-gray-300">|</span>
                <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">이용약관</a>
              </div>
            </div> */}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              &copy; 2025 피어테라(주). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

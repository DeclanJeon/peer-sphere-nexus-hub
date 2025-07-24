// UserPeermallLayout.tsx 수정 부분
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
  LogOut,
  Menu,
  Settings,
  LogIn,
  Plus,
  Package,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';
import ProductModal from '@/components/common/product/ProductModal';
import Footer from './Footer';

interface UserPeermallLayoutProps {
  children: ReactNode;
}

const UserPeermallLayout = ({ children }: UserPeermallLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentPeermall } = usePeermall();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const handleProductCreateSuccess = () => {
    // 제품 목록 페이지로 이동 또는 새로고침
    navigate(`/home/${currentPeermall?.url}/products`);
  };

  const peermallAddress = currentPeermall?.url || '';
  const navigation = [
    // { name: '홈', href: `/home/${peermallAddress}`, icon: Home },
    // { name: '제품', href: `/home/${peermallAddress}/products`, icon: ShoppingBag },
    // { name: '커뮤니티', href: `/home/${peermallAddress}/community`, icon: MessageCircle },
    // { name: '이벤트', href: `/home/${peermallAddress}/events`, icon: Calendar },
  ];

  // 피어몰 소유자인지 확인
  const isOwner = currentPeermall?.ownerId === user?.email || 
                  currentPeermall?.owner_id === user?.id;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link to={`/home/${currentPeermall?.url}`} className="flex-shrink-0">
                {currentPeermall?.imageUrl || currentPeermall?.image_url ? (
                  <img className="h-12 w-12 rounded-full object-cover" src={currentPeermall.imageUrl || currentPeermall.image_url} alt={currentPeermall.name} />
                ) : (
                  <img className="h-10 w-auto" src="/logo.png" alt="PeerMall" />
                )}
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{currentPeermall?.name}</h1>
                <p className="text-sm text-gray-500">{currentPeermall?.familyCompany}</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.href
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              {/* 제품 등록 버튼 - 로그인한 소유자만 표시 */}
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
                          <AvatarFallback>{user?.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="px-2 py-1.5 text-sm font-medium">{user?.email}</div>
                      <DropdownMenuSeparator />
                      {isOwner && (
                        <>
                          <DropdownMenuItem onClick={() => setIsProductModalOpen(true)}>
                            <Package className="mr-2 h-4 w-4" />
                            <span>제품 등록</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem asChild><Link to="/mypage/info" className="flex items-center"><Settings className="mr-2 h-4 w-4" /><span>내 정보 관리</span></Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/mypage/mall" className="flex items-center"><Store className="mr-2 h-4 w-4" /><span>내 피어몰 관리</span></Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /><span>로그아웃</span></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" asChild><Link to="/login"><LogIn className="h-4 w-4 mr-2" />로그인</Link></Button>
                )}
              </div>
              <div className="md:hidden">
                <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>
        </div>

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
              <div className="border-t my-2"></div>
              {isAuthenticated ? (
                 <div className="px-3 py-2">
                    <div className="text-sm font-medium mb-2">{user?.email}</div>
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
                    <Link to="/mypage/info" className="flex items-center w-full text-left py-2 text-muted-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}><Settings className="mr-2 h-4 w-4" /><span>내 정보 관리</span></Link>
                    <Link to="/mypage/mall" className="flex items-center w-full text-left py-2 text-muted-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}><Store className="mr-2 h-4 w-4" /><span>내 피어몰 관리</span></Link>
                    <button onClick={handleLogout} className="flex items-center w-full text-left py-2 text-red-600"><LogOut className="mr-2 h-4 w-4" /><span>로그아웃</span></button>
                 </div>
              ) : (
                <Button size="sm" asChild className="w-full justify-start"><Link to="/login"><LogIn className="h-4 w-4 mr-2" />로그인</Link></Button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* 제품 등록 모달 */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={handleProductCreateSuccess}
        mode="create"
      />
    </div>
  );
};

export default UserPeermallLayout;
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
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';

interface UserPeermallLayoutProps {
  children: ReactNode;
}

const UserPeermallLayout = ({ children }: UserPeermallLayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentPeermall } = usePeermall();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const peermallAddress = currentPeermall?.url || '';
  const navigation = [
    // { name: '홈', href: `/peermall/${peermallAddress}`, icon: Home },
    // { name: '제품', href: `/peermall/${peermallAddress}/products`, icon: ShoppingBag },
    // { name: '커뮤니티', href: `/peermall/${peermallAddress}/community`, icon: MessageCircle },
    // { name: '이벤트', href: `/peermall/${peermallAddress}/events`, icon: Calendar },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link to={`/peermall/${currentPeermall?.url}`} className="flex-shrink-0">
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

      <footer className="bg-muted border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 {currentPeermall?.name || '피어몰'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPeermallLayout;
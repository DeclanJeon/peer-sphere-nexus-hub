
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
  Star,
  Package,
  LogIn,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';

interface UserPeermallLayoutProps {
  children: ReactNode;
}

const UserPeermallLayout = ({ children }: UserPeermallLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentPeermall } = usePeermall();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const peermallUrl = currentPeermall?.url || '';
  const navigation = [
    { name: '홈', href: `/peermall/${peermallUrl}`, icon: Home },
    { name: '제품', href: `/peermall/${peermallUrl}/products`, icon: ShoppingBag },
    { name: '커뮤니티', href: `/peermall/${peermallUrl}/community`, icon: MessageCircle },
    { name: '이벤트', href: `/peermall/${peermallUrl}/events`, icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <Link to={`/peermall/${peermallUrl}`} className="text-2xl font-bold text-primary">
                  {currentPeermall?.name || '피어몰'}
                </Link>
                <p className="text-sm text-muted-foreground">{currentPeermall?.creatorName}</p>
              </div>
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    로그인
                  </Link>
                </Button>
              )}
              
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
            <p>&copy; 2025 {currentPeermall?.name || '피어몰'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPeermallLayout;

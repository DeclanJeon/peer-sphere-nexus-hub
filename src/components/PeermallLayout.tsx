// src/components/PeermallLayout.tsx
import { ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
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
  FileText,
  Star,
  Package
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9393';

interface PeermallData {
  name: string;
  description: string;
  imageUrl?: string;
}

interface LayoutProps {
  children: ReactNode;
}

const PeermallLayout = ({ children }: LayoutProps) => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [peermall, setPeermall] = useState<PeermallData | null>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const fetchPeermallData = async () => {
      if (!url) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/peermalls/${url}`);
        if (response.data.success) {
          setPeermall(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        toast({
          title: '오류',
          description: error.message || '피어몰 정보를 불러오는 데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };
    fetchPeermallData();
  }, [url]);

  const handleLogout = async () => {
    await logout();
  };

  const navigation = [
    { name: '홈', href: `/peermall/${url}`, icon: Home },
    { name: '제품', href: `/peermall/${url}/products`, icon: ShoppingBag },
    { name: '커뮤니티', href: `/peermall/${url}/community`, icon: MessageCircle },
    { name: '이벤트', href: `/peermall/${url}/events`, icon: Calendar },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to={`/peermall/${url}`} className="text-2xl font-bold text-primary">
                {peermall ? peermall.name : '피어몰'}
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}>
                    <Icon className="h-5 w-5" />
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
                    <DropdownMenuItem onClick={() => navigate('/mypage/mall-info')}>
                      <Store className="mr-2 h-4 w-4" />
                      <span>내 피어몰</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" size="sm" onClick={() => navigate('/login')}>로그인</Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="h-4 w-4" />
              </Button>
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
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <>
                  <div className="border-t my-2" />
                  <Link
                    to="/mypage/mall-info"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Store className="h-5 w-5" />
                    <span>내 피어몰</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>로그아웃</span>
                  </button>
                </>
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
            <p>&copy; 2024 {peermall ? peermall.name : '피어몰'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
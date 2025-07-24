import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  ShoppingBag, 
  MessageCircle, 
  Calendar,
  User,
  Settings,
  BarChart3,
  Star
} from 'lucide-react';

const menuItems = [
  { 
    id: 'overview', 
    title: '대시보드', 
    icon: BarChart3,
    path: '/mypage/manage/overview'
  },
  { 
    id: 'profile', 
    title: '개인정보 관리', 
    icon: User,
    path: '/mypage/manage/profile'
  },
  { 
    id: 'peermall', 
    title: '내 피어몰 관리', 
    icon: Store,
    path: '/mypage/manage/peermall'
  },
  { 
    id: 'products', 
    title: '내 상품 관리', 
    icon: ShoppingBag,
    path: '/mypage/manage/products'
  },
  { 
    id: 'community', 
    title: '내 게시글 관리', 
    icon: MessageCircle,
    path: '/mypage/manage/community'
  },
  { 
    id: 'events', 
    title: '내 이벤트 관리', 
    icon: Calendar,
    path: '/mypage/manage/events'
  },
  { 
    id: 'comments', 
    title: '댓글 관리', 
    icon: MessageCircle,
    path: '/mypage/manage/comments'
  },
  { 
    id: 'reviews', 
    title: '리뷰 관리', 
    icon: Star,
    path: '/mypage/manage/reviews'
  },
];

function ManagementSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>관리 메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <Link to={item.path}>
                    <SidebarMenuButton 
                      className={
                        location.pathname === item.path
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ManagePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">관리 센터</h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/">메인으로 돌아가기</Link>
          </Button>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <SidebarProvider>
        <div className="flex w-full">
          <ManagementSidebar />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default ManagePage;
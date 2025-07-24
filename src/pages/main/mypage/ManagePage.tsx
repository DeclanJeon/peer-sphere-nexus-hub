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
  BarChart3
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ManagementSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">관리 센터</h1>
              </div>
              <Button asChild variant="outline">
                <Link to="/">메인으로 돌아가기</Link>
              </Button>
            </div>
            
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default ManagePage;
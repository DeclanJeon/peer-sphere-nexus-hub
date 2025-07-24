import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Store, 
  ShoppingBag, 
  MessageCircle, 
  Calendar,
  User,
  Settings,
  BarChart3
} from 'lucide-react';
import { PeermallManagement } from '@/components/admin/PeermallManagement';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { CommunityManagement } from '@/components/admin/CommunityManagement';
import { EventManagement } from '@/components/admin/EventManagement';
import { ProfileManagement } from '@/components/admin/ProfileManagement';

type ManagementSection = 
  | 'overview' 
  | 'peermall' 
  | 'products' 
  | 'community' 
  | 'events' 
  | 'profile';

const menuItems = [
  { 
    id: 'overview' as ManagementSection, 
    title: '내 정보 관리', 
    icon: BarChart3 
  },
  { 
    id: 'peermall' as ManagementSection, 
    title: '내 피어몰 관리', 
    icon: Store 
  },
  { 
    id: 'products' as ManagementSection, 
    title: '내 상품 관리', 
    icon: ShoppingBag 
  },
  { 
    id: 'community' as ManagementSection, 
    title: '내 게시글 관리', 
    icon: MessageCircle 
  },
  { 
    id: 'events' as ManagementSection, 
    title: '내 이벤트 관리', 
    icon: Calendar 
  },
  { 
    id: 'profile' as ManagementSection, 
    title: '개인정보 관리', 
    icon: User 
  },
];

function ManagementSidebar({ 
  activeSection, 
  onSectionChange 
}: { 
  activeSection: ManagementSection;
  onSectionChange: (section: ManagementSection) => void;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    className={
                      activeSection === item.id 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "hover:bg-muted/50"
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function OverviewSection() {
  const stats = [
    { title: '내 피어몰', value: '1개', icon: Store },
    { title: '내 상품', value: '12개', icon: ShoppingBag },
    { title: '내 게시글', value: '8개', icon: MessageCircle },
    { title: '내 이벤트', value: '3개', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">관리 현황</h2>
        <p className="text-muted-foreground">
          등록하신 콘텐츠들의 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded border">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 상품이 등록되었습니다</p>
                <p className="text-sm text-muted-foreground">
                  프리미엄 스킨케어 세트 - 2시간 전
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 댓글이 달렸습니다</p>
                <p className="text-sm text-muted-foreground">
                  피어몰 운영 꿀팁 게시글 - 4시간 전
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 이벤트가 시작되었습니다</p>
                <p className="text-sm text-muted-foreground">
                  신제품 런칭 이벤트 - 1일 전
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ManagePage() {
  const [activeSection, setActiveSection] = useState<ManagementSection>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'peermall':
        return <PeermallManagement />;
      case 'products':
        return <ProductManagement />;
      case 'community':
        return <CommunityManagement />;
      case 'events':
        return <EventManagement />;
      case 'profile':
        return <ProfileManagement />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ManagementSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">관리 센터</h1>
              </div>
              <Button asChild variant="outline">
                <Link to="/mypage">마이페이지로 돌아가기</Link>
              </Button>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default ManagePage;
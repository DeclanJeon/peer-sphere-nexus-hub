import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
// SearchSection import는 이 컴포넌트에서 사용되지 않으므로 제거해도 좋습니다.
// import SearchSection from './SearchSection'; 
// useState도 더 이상 필요 없습니다.
// import { useState } from 'react';

// Props 인터페이스는 MainLayout과의 상호작용을 위해 유지합니다.
interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  // 드롭다운 메뉴의 활성화 상태를 결정하기 위한 로직
  const isNewActive = activeTab.startsWith('new');
  const isBestActive = activeTab.startsWith('best');

  return (
    <section className="bg-white border-b sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <NavigationMenu className="justify-start">
          <NavigationMenuList className="flex justify-start space-x-2">
            {/* 전체 탭 - MainPage로 이동 */}
            <NavigationMenuItem>
              <Link
                to="/"
                onClick={() => setActiveTab('all')}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "font-semibold hover:text-primary transition-colors",
                  activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                )}
              >
                전체
              </Link>
            </NavigationMenuItem>
            
            {/* 신규 탭 with 드롭다운 */}
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger 
                className={cn(
                  "font-semibold",
                  // activeTab prop을 사용하여 드롭다운 트리거의 활성 상태를 제어합니다.
                  isNewActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                신규
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/peermalls?tab=new" // URL에 쿼리 파라미터 추가
                        // setActiveTab은 PeermallPage에서 URL을 통해 상태를 관리하므로 제거합니다.
                        // MainLayout의 상태를 업데이트해야 한다면 유지할 수 있습니다. 
                        // 예: onClick={() => setActiveTab('new-peermalls')}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">신규 피어몰</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          새로 오픈한 피어몰들
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/products?tab=new" // 제품 페이지도 동일한 패턴 적용
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">신규 제품</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          새로 등록된 제품들
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* 베스트 탭 with 드롭다운 */}
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger 
                className={cn(
                  "font-semibold",
                  isBestActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                베스트
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/peermalls?tab=best" // URL에 쿼리 파라미터 추가
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">베스트 피어몰</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          인기 높은 피어몰들
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/products?tab=best" // 제품 페이지도 동일한 패턴 적용
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">베스트 제품</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          인기 높은 제품들
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* 커뮤니티 탭 - 직접 이동 */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  to="/community"
                  onClick={() => setActiveTab('community')}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-semibold hover:text-primary transition-colors",
                    activeTab === 'community' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                  )}
                >
                  커뮤니티
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* 이벤트 탭 - 직접 이동 */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  to="/events"
                  onClick={() => setActiveTab('events')}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-semibold hover:text-primary transition-colors",
                    activeTab === 'events' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                  )}
                >
                  이벤트
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </section>
  );
};

export default NavigationTabs;
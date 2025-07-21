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
import SearchSection from './SearchSection';
import { useState } from 'react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  return (
    <section className="bg-white border-b sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <NavigationMenu className="justify-start">
          <NavigationMenuList className="flex justify-start space-x-2">
            {/* 전체 탭 */}
            <NavigationMenuItem>
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "font-semibold hover:text-primary transition-colors",
                  activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                )}
              >
                전체
              </button>
            </NavigationMenuItem>
            
            {/* 신규 탭 with 드롭다운 */}
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger 
                className={cn(
                  "font-semibold",
                  activeTab.includes('new') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                신규
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/peermalls/new"
                        onClick={() => setActiveTab('new-peermalls')}
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
                        to="/products/new"
                        onClick={() => setActiveTab('new-products')}
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
                  activeTab.includes('best') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                베스트
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/peermalls/best"
                        onClick={() => setActiveTab('best-peermalls')}
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
                        to="/products/best"
                        onClick={() => setActiveTab('best-products')}
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

            {/* 커뮤니티 탭 with 드롭다운 */}
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger 
                className={cn(
                  "font-semibold",
                  activeTab === 'community' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                커뮤니티
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <button
                      onClick={() => setActiveTab('community')}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                    >
                      <div className="text-sm font-medium leading-none">메인에서 보기</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        메인 페이지에서 커뮤니티 보기
                      </p>
                    </button>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/community"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">커뮤니티 페이지</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          전체 게시글 보기
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* 이벤트 탭 with 드롭다운 */}
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger 
                className={cn(
                  "font-semibold",
                  activeTab === 'events' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                이벤트
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                    >
                      <div className="text-sm font-medium leading-none">메인에서 보기</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        메인 페이지에서 이벤트 보기
                      </p>
                    </button>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/events"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">이벤트 페이지</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          전체 이벤트 보기
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>

        </NavigationMenu>
      </div>
    </section>
  );
};

export default NavigationTabs;
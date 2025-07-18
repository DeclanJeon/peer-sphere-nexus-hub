
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  return (
    <section className="bg-white border-b sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-full">
          <NavigationMenuList className="flex justify-center space-x-8 py-4">
            <NavigationMenuItem>
              <button
                onClick={() => setActiveTab('all')}
                className={`font-semibold hover:text-primary transition-colors px-4 py-2 ${
                  activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
              >
                전체
              </button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`font-semibold ${
                  activeTab === 'new' ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('new')}
              >
                신규
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-48 gap-2 p-4">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/peermalls/new" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">신규 피어몰</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        새로 오픈한 피어몰들
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/products/new"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">신규 제품</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        새로 등록된 제품들
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`font-semibold ${
                  activeTab === 'best' ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('best')}
              >
                베스트
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-48 gap-2 p-4">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/peermalls/best"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">베스트 피어몰</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        인기 높은 피어몰들
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/products/best"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">베스트 제품</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        인기 높은 제품들
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <button
                onClick={() => setActiveTab('community')}
                className={`font-semibold hover:text-primary transition-colors px-4 py-2 ${
                  activeTab === 'community' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
              >
                커뮤니티
              </button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <button
                onClick={() => setActiveTab('events')}
                className={`font-semibold hover:text-primary transition-colors px-4 py-2 ${
                  activeTab === 'events' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
              >
                이벤트
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </section>
  );
};

export default NavigationTabs;

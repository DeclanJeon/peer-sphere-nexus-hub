
import { ReactNode, useState } from 'react';

import Header from './Header';
import Footer from './Footer';
import NavigationTabs from '../home/NavigationTabs';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

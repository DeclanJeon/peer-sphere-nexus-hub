// src/components/layout/UserPeermallLayout.tsx

import { ReactNode } from 'react';
import { usePeermall } from '@/contexts/PeermallContext';

import UserFooter from './UserFooter';
import UserHeader from './UserHeader';
import UserNavigationTabs from '@/pages/user-peermall/home/UserNavigationTabs';

interface UserPeermallLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UserPeermallLayout = ({ children, activeTab, setActiveTab }: UserPeermallLayoutProps) => {
  // 레이아웃은 데이터(currentPeermall)를 가져와서
  // 필요한 자식 컴포넌트(Header, Footer)에 전달하는 역할만 수행합니다.
  const { currentPeermall } = usePeermall();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. 헤더 렌더링 */}
      <UserHeader currentPeermall={currentPeermall} />
      <UserNavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. 메인 컨텐츠 렌더링 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 3. 푸터 렌더링 */}
      <UserFooter currentPeermall={currentPeermall} />
    </div>
  );
};

export default UserPeermallLayout;
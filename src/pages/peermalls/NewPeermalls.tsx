import { Calendar } from 'lucide-react';
import { useState } from 'react';
import PeermallCard from '@/components/shared/PeermallCard';
import { Peermall } from '@/types/peermall';

const NewPeermalls = () => {
  // ========== 목업 데이터 START ==========
  // 실제 API 연동 시 제거 예정인 더미 데이터입니다.
  const mockNewPeermalls: Peermall[] = [
    {
      id: '1',
      name: '프레시 마켓',
      description: '신선한 농산물과 유기농 제품을 판매하는 피어몰입니다.',
      url: 'fresh-market',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop',
      rating: 4.8,
      sales_volume: 156,
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      status: 'active',
      referrerCode: 'REF001',
      creatorName: '김신선',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop',
      family_company: '프레시 농장',
      creator_name: '김신선',
      owner_email: 'fresh@example.com',
      owner_phone: '010-1234-5678',
      follower_count: 234,
      referrer_code: 'REF001',
      is_new: true
    },
    {
      id: '2',
      name: '테크 이노베이션',
      description: '최신 IT 제품과 가젯을 만나보세요.',
      url: 'tech-innovation',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      rating: 4.9,
      sales_volume: 89,
      created_at: '2024-01-19',
      updated_at: '2024-01-19',
      status: 'active',
      referrerCode: 'REF002',
      creatorName: '이기술',
      image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      family_company: '테크 솔루션',
      creator_name: '이기술',
      owner_email: 'tech@example.com',
      owner_phone: '010-2345-6789',
      follower_count: 456,
      referrer_code: 'REF002',
      is_new: true
    },
    {
      id: '3',
      name: '스타일 갤러리',
      description: '트렌디한 패션 아이템과 액세서리를 판매합니다.',
      url: 'style-gallery',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop',
      rating: 4.7,
      sales_volume: 234,
      created_at: '2024-01-18',
      updated_at: '2024-01-18',
      status: 'active',
      referrerCode: 'REF003',
      creatorName: '박패션',
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop',
      family_company: '스타일 컴퍼니',
      creator_name: '박패션',
      owner_email: 'style@example.com',
      owner_phone: '010-3456-7890',
      follower_count: 789,
      referrer_code: 'REF003',
      is_new: true
    },
    {
      id: '4',
      name: '홈 데코',
      description: '인테리어 소품과 가구로 집을 꾸며보세요.',
      url: 'home-deco',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=200&fit=crop',
      rating: 4.6,
      sales_volume: 67,
      created_at: '2024-01-17',
      updated_at: '2024-01-17',
      status: 'active',
      referrerCode: 'REF004',
      creatorName: '최인테리어',
      image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=200&fit=crop',
      family_company: '홈 디자인',
      creator_name: '최인테리어',
      owner_email: 'home@example.com',
      owner_phone: '010-4567-8901',
      follower_count: 345,
      referrer_code: 'REF004',
      is_new: true
    },
    {
      id: '5',
      name: '펫 케어',
      description: '반려동물을 위한 모든 용품을 판매합니다.',
      url: 'pet-care',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop',
      rating: 4.8,
      sales_volume: 123,
      created_at: '2024-01-16',
      updated_at: '2024-01-16',
      status: 'active',
      referrerCode: 'REF005',
      creatorName: '강애완',
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop',
      family_company: '펫 월드',
      creator_name: '강애완',
      owner_email: 'pet@example.com',
      owner_phone: '010-5678-9012',
      follower_count: 567,
      referrer_code: 'REF005',
      is_new: true
    },
    {
      id: '6',
      name: '헬스 앤 뷰티',
      description: '건강과 아름다움을 위한 제품들을 만나보세요.',
      url: 'health-beauty',
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
      rating: 4.9,
      sales_volume: 445,
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      status: 'active',
      referrerCode: 'REF006',
      creatorName: '윤뷰티',
      image_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
      family_company: '뷰티 랩',
      creator_name: '윤뷰티',
      owner_email: 'beauty@example.com',
      owner_phone: '010-6789-0123',
      follower_count: 1234,
      referrer_code: 'REF006',
      is_new: true
    }
  ];
  // ========== 목업 데이터 END ==========

  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>(mockNewPeermalls);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">신규 피어몰</h1>
      </div>
      <p className="text-muted-foreground mb-8">최근에 새롭게 개설된 피어몰들을 만나보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newPeermalls && newPeermalls.length > 0 ? (
          newPeermalls.map((peermall) => (
            <PeermallCard key={peermall.id} peermall={peermall} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            신규 피어몰이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPeermalls;
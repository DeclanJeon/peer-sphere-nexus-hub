import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Star, 
  Eye,
  Heart,
  Share2,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 목업 데이터 타입
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  rating: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  features: string[];
  specifications: { [key: string]: string };
  views: number;
  likes: number;
}

const UserProductDetail = () => {
  const { url, productId } = useParams<{ url: string; productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 목업 데이터 - 실제 API 연동 시 제거
  useEffect(() => {
    const mockProduct: Product = {
      id: productId || '1',
      name: '프리미엄 스킨케어 세트',
      price: 89000,
      description: '자연 성분으로 만든 프리미엄 스킨케어 세트입니다. 민감한 피부에도 안전하게 사용할 수 있으며, 깊은 보습과 영양을 제공합니다. 천연 추출물과 비타민이 풍부하게 함유되어 피부를 건강하게 가꿔줍니다.',
      category: '뷰티',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      rating: 4.8,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      features: [
        '100% 천연 성분 사용',
        '모든 피부 타입에 적합',
        '파라벤, 실리콘 무첨가',
        '동물실험 반대 제품',
        '친환경 포장재 사용'
      ],
      specifications: {
        '용량': '토너 150ml, 에센스 50ml, 크림 50ml',
        '사용법': '세안 후 토너 → 에센스 → 크림 순서로 사용',
        '보관방법': '직사광선을 피해 서늘한 곳에 보관',
        '유통기한': '제조일로부터 24개월',
        '제조국': '대한민국'
      },
      views: 1247,
      likes: 89
    };

    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleDelete = async () => {
    try {
      // TODO: 실제 API 연동
      // await productService.deleteProduct(productId);
      
      toast({
        title: "상품 삭제 완료",
        description: "상품이 성공적으로 삭제되었습니다."
      });
      
      navigate(`/${url}/products`);
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "상품 삭제 중 오류가 발생했습니다."
      });
    }
  };

  const handleStatusToggle = async () => {
    if (!product) return;
    
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      
      // TODO: 실제 API 연동
      // await productService.updateProductStatus(productId, newStatus);
      
      setProduct(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: "상태 변경 완료",
        description: `상품이 ${newStatus === 'active' ? '판매 중' : '판매 중단'} 상태로 변경되었습니다.`
      });
    } catch (error) {
      console.error('상태 변경 오류:', error);
      toast({
        variant: "destructive",
        title: "상태 변경 실패",
        description: "상품 상태 변경 중 오류가 발생했습니다."
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate(`/${url}/products`)}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${url}/products`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                조회 {product.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                좋아요 {product.likes}
              </span>
              <span>등록일 {product.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge 
            variant={product.status === 'active' ? 'default' : 'secondary'}
            className="text-sm"
          >
            {product.status === 'active' ? '판매중' : '판매중단'}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStatusToggle}>
                {product.status === 'active' ? '판매 중단' : '판매 재개'}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/${url}/products/${product.id}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  수정
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 상품 이미지 */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{product.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
            </div>
            
            <p className="text-3xl font-bold text-primary mb-4">
              {product.price.toLocaleString()}원
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <Link to={`/${url}/products/${product.id}/edit`} className="flex-1">
              <Button className="w-full" variant="outline">
                <Edit3 className="h-4 w-4 mr-2" />
                수정
              </Button>
            </Link>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 상품이 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              문의
            </Button>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="mt-12 space-y-8">
        {/* 상품 특징 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">상품 특징</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 상품 사양 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">상품 사양</h3>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row gap-2">
                  <dt className="font-medium text-muted-foreground min-w-[120px]">
                    {key}
                  </dt>
                  <dd className="flex-1">{value}</dd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProductDetail;
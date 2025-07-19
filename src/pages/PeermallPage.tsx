import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, ShoppingBag, MessageCircle, Heart, Home, ArrowRight } from 'lucide-react';
import HeroSection from '@/components/dashboard/HeroSection';
import SearchSection from '@/components/dashboard/SearchSection';
import { peermallService, productService } from '@/lib/indexeddb';
import type { Peermall, Product } from '@/lib/indexeddb/database';

const PeermallPage = () => {
  const { name } = useParams<{ name: string }>();
  const [peermall, setPeermall] = useState<Peermall | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPeermallData = async () => {
      if (!name) return;
      
      try {
        // 피어몰 이름으로 검색
        const allPeermalls = await peermallService.getAllPeermalls();
        const decodedName = decodeURIComponent(name);
        const foundPeermall = allPeermalls.find(p => p.name === decodedName);
        
        if (foundPeermall) {
          setPeermall(foundPeermall);
          // 해당 피어몰의 제품들 로드
          const peermallProducts = await productService.getProductsByPeermallId(foundPeermall.id);
          setProducts(peermallProducts);
        }
      } catch (error) {
        console.error('피어몰 데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPeermallData();
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>피어몰 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!peermall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">피어몰을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-6">요청하신 피어몰이 존재하지 않거나 삭제되었습니다.</p>
          <Link to="/dashboard">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              메인으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 베스트 상품 (평점이나 판매량 기준으로 정렬)
  const bestProducts = products
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  // 신규 상품 (최근 생성순)
  const newProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - 피어몰 정보 */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/dashboard" className="hover:text-primary">홈</Link>
                <ArrowRight className="h-4 w-4" />
                <span>피어몰</span>
                <ArrowRight className="h-4 w-4" />
                <span className="text-foreground">{peermall.name}</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold">{peermall.name}</h1>
                  <Badge variant="secondary" className="text-sm">
                    {peermall.category}
                  </Badge>
                </div>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {peermall.description}
                </p>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{peermall.rating}</span>
                    <span className="text-muted-foreground">평점</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{peermall.sales}</span>
                    <span className="text-muted-foreground">거래</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{peermall.familyCompany}</span>
                    <span className="text-muted-foreground">패밀리사</span>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button size="lg">
                    <Heart className="h-4 w-4 mr-2" />
                    팔로우
                  </Button>
                  <Button variant="outline" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    문의하기
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl">
                {peermall.image ? (
                  <img 
                    src={peermall.image} 
                    alt={peermall.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <ShoppingBag className="h-24 w-24 text-primary/40" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">
          
          {/* 베스트 상품 */}
          {bestProducts.length > 0 && (
            <div>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">베스트 상품</CardTitle>
                    <p className="text-muted-foreground">인기 높은 베스트 상품들을 만나보세요</p>
                  </div>
                  {products.length > 8 && (
                    <Button variant="outline" asChild>
                      <Link to={`/peermall/${encodeURIComponent(peermall.name)}/products`}>
                        전체보기
                      </Link>
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {bestProducts.map((product) => (
                      <Link key={product.id} to={`/products/${product.id}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                          <CardContent className="p-3">
                            <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-muted">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                            <p className="text-primary font-bold text-sm mb-2">{product.price.toLocaleString()}원</p>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{product.rating}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 신규 상품 */}
          {newProducts.length > 0 && (
            <div>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">신규 상품</CardTitle>
                    <p className="text-muted-foreground">새롭게 등록된 상품들을 확인해보세요</p>
                  </div>
                  {products.length > 8 && (
                    <Button variant="outline" asChild>
                      <Link to={`/peermall/${encodeURIComponent(peermall.name)}/products`}>
                        전체보기
                      </Link>
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newProducts.map((product) => (
                      <Link key={product.id} to={`/products/${product.id}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                          <CardContent className="p-3">
                            <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-muted">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                            <p className="text-primary font-bold text-sm mb-2">{product.price.toLocaleString()}원</p>
                            <Badge variant="outline" className="text-xs">신규</Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 상품이 없는 경우 */}
          {products.length === 0 && (
            <Card className="shadow-lg">
              <CardContent className="text-center py-16">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">등록된 상품이 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  {peermall.name}에 아직 등록된 상품이 없습니다. 곧 다양한 상품들이 등록될 예정입니다.
                </p>
                <Link to="/dashboard">
                  <Button variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    다른 피어몰 둘러보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 피어몰 정보 상세 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>피어몰 소개</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {peermall.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">기본 정보</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">주소:</span> {peermall.address}</p>
                        <p><span className="text-muted-foreground">카테고리:</span> {peermall.category}</p>
                        <p><span className="text-muted-foreground">패밀리사:</span> {peermall.familyCompany}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">운영 정보</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">운영자:</span> {peermall.ownerName}</p>
                        <p><span className="text-muted-foreground">오픈일:</span> {new Date(peermall.createdAt).toLocaleDateString()}</p>
                        <p><span className="text-muted-foreground">상태:</span> 
                          <Badge variant={peermall.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                            {peermall.status === 'active' ? '운영중' : '일시정지'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>통계</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">등록 상품</span>
                    </div>
                    <span className="font-semibold">{products.length}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">평점</span>
                    </div>
                    <span className="font-semibold">{peermall.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">총 거래</span>
                    </div>
                    <span className="font-semibold">{peermall.sales}건</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>연락하기</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    메시지 보내기
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    팔로우 하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeermallPage;
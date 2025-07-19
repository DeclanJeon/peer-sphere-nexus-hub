import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Package, Plus, Edit, Trash2 } from 'lucide-react';
import { peermallService, productService } from '@/lib/indexeddb';
import type { Peermall, Product } from '@/lib/indexeddb/database';

const PeermallManagement = () => {
  const { id } = useParams<{ id: string }>();
  const [peermall, setPeermall] = useState<Peermall | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        const peermallData = await peermallService.getPeermallById(id);
        if (peermallData) {
          setPeermall(peermallData);
          const productData = await productService.getProductsByPeermallId(id);
          setProducts(productData);
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">로딩 중...</div>;
  }

  if (!peermall) {
    return <div className="container mx-auto px-4 py-8">피어몰을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{peermall.name} 관리</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{peermall.category}</Badge>
          <Badge variant="outline">{peermall.familyCompany}</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
          <TabsTrigger value="products">상품 관리</TabsTrigger>
          <TabsTrigger value="customization">커스터마이징</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>주소:</strong> {peermall.address}</p>
                  <p><strong>소유자:</strong> {peermall.ownerName}</p>
                  <p><strong>패밀리사:</strong> {peermall.familyCompany}</p>
                  <p><strong>평점:</strong> {peermall.rating}/5</p>
                  <p><strong>상태:</strong> {peermall.status === 'active' ? '활성' : '비활성'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>등록 상품:</strong> {products.length}개</p>
                  <p><strong>총 판매:</strong> {peermall.sales}건</p>
                  <p><strong>생성일:</strong> {new Date(peermall.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>빠른 액션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to={`/peermalls/${id}/products/create`}>
                  <Button className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    상품 등록
                  </Button>
                </Link>
                <Link to={`/peermalls/${id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    피어몰 보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>피어몰 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to={`/peermalls/${id}/edit`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    기본 정보 수정
                  </Button>
                </Link>
                <Link to={`/peermalls/${id}/customize`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    피어몰 커스터마이징
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">상품 목록</h2>
              <Link to={`/peermalls/${id}/products/create`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  새 상품 등록
                </Button>
              </Link>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">등록된 상품이 없습니다.</p>
                  <Link to={`/peermalls/${id}/products/create`}>
                    <Button className="mt-4">
                      첫 상품 등록하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.price.toLocaleString()}원</p>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="customization">
          <Card>
            <CardHeader>
              <CardTitle>피어몰 커스터마이징</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">로고 설정</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">피어몰의 로고를 설정하세요.</p>
                      <Button variant="outline">로고 업로드</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">푸터 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">푸터에 표시될 정보를 설정하세요.</p>
                      <Button variant="outline">푸터 편집</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">회사 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">회사 정보를 입력하세요.</p>
                      <Button variant="outline">회사 정보 편집</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeermallManagement;
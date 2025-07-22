import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Eye, Edit, Trash2, Plus, TrendingUp } from 'lucide-react';

const MyProducts = () => {
  const products = [
    {
      id: 1,
      name: '프리미엄 스킨케어 세트',
      price: '89,000원',
      category: '뷰티',
      views: 156,
      sales: 12,
      stock: 25,
      status: '판매중',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: '립스틱 컬렉션',
      price: '45,000원',
      category: '뷰티',
      views: 89,
      sales: 8,
      stock: 0,
      status: '품절',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      name: '아이섀도우 팔레트',
      price: '32,000원',
      category: '뷰티',
      views: 234,
      sales: 15,
      stock: 10,
      status: '판매중',
      createdAt: '2024-01-13'
    },
    {
      id: 4,
      name: '페이스 마스크 세트',
      price: '25,000원',
      category: '뷰티',
      views: 67,
      sales: 0,
      stock: 50,
      status: '판매중지',
      createdAt: '2024-01-12'
    },
  ];

  const handleDelete = (productId: number) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      console.log('Delete product:', productId);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case '판매중': return 'default';
      case '품절': return 'destructive';
      case '판매중지': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">내 제품 관리</h1>
        </div>
        <Button asChild>
          <Link to="/products/create">
            <Plus className="h-4 w-4 mr-2" />
            새 상품 등록
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-sm text-muted-foreground">총 상품</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">546</div>
            <div className="text-sm text-muted-foreground">총 조회수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">35</div>
            <div className="text-sm text-muted-foreground">총 판매량</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">8</div>
            <div className="text-sm text-muted-foreground">판매중 상품</div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 rounded border hover:bg-muted/50">
                <div className="w-16 h-16 bg-muted rounded"></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant={getStatusVariant(product.status)}>
                      {product.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{product.createdAt}</span>
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-primary font-bold mb-2">{product.price}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>조회 {product.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>판매 {product.sales}</span>
                    </div>
                    <div>
                      <span>재고 {product.stock}개</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/products/edit/${product.id}`}>
                      <Edit className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProducts;
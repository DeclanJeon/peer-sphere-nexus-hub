import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  ShoppingBag,
  Package,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// TODO: Replace with actual API data
const mockProducts = [
  {
    id: '1',
    name: '프리미엄 스킨케어 세트',
    price: 150000,
    sellingPrice: 120000,
    category: '뷰티',
    status: 'active' as const,
    peermallName: '김민수의 뷰티샵',
    views: 245,
    likes: 32,
    createdAt: '2024-01-20',
    imageUrl: '/placeholder-product.jpg',
  },
  {
    id: '2',
    name: '무선 이어폰 프로',
    price: 200000,
    sellingPrice: 180000,
    category: '전자제품',
    status: 'inactive' as const,
    peermallName: '테크 가젯 스토어',
    views: 189,
    likes: 15,
    createdAt: '2024-02-15',
    imageUrl: '/placeholder-product.jpg',
  },
];

const statusLabels = {
  active: { label: '판매중', variant: 'default' as const },
  inactive: { label: '판매중지', variant: 'secondary' as const },
};

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState(mockProducts);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.peermallName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (productId: string) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit product:', productId);
  };

  const handleDelete = (productId: string) => {
    // TODO: Show confirmation dialog and delete product
    console.log('Delete product:', productId);
  };

  const handleCreate = () => {
    // TODO: Navigate to create page
    console.log('Create new product');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const calculateDiscount = (originalPrice: number, sellingPrice: number) => {
    return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">상품 관리</h2>
          <p className="text-muted-foreground">
            등록된 상품을 관리하고 편집하세요.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          새 상품 등록
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 상품</p>
                <p className="text-2xl font-bold">{products.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">활성 상품</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.status === 'active').length}개
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 조회수</p>
                <p className="text-2xl font-bold">
                  {formatNumber(products.reduce((sum, p) => sum + p.views, 0))}회
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품명, 카테고리 또는 피어몰로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품 정보</TableHead>
                  <TableHead>가격</TableHead>
                  <TableHead>피어몰</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>조회/좋아요</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatCurrency(product.sellingPrice)}
                        </div>
                        {product.price !== product.sellingPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.price)}
                            <span className="ml-1 text-destructive">
                              {calculateDiscount(product.price, product.sellingPrice)}% 할인
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{product.peermallName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusLabels[product.status].variant}>
                        {statusLabels[product.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>조회 {formatNumber(product.views)}</div>
                        <div>좋아요 {formatNumber(product.likes)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
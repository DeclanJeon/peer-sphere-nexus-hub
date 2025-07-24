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
  Store,
  Users,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// TODO: Replace with actual API data
const mockPeermalls = [
  {
    id: '1',
    name: '김민수의 뷰티샵',
    url: 'beauty-shop-kim',
    status: 'active' as const,
    followerCount: 1250,
    salesVolume: 45000000,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '2', 
    name: '테크 가젯 스토어',
    url: 'tech-gadget-store',
    status: 'inactive' as const,
    followerCount: 890,
    salesVolume: 12000000,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15',
  },
];

const statusLabels = {
  active: { label: '활성', variant: 'default' as const },
  inactive: { label: '비활성', variant: 'secondary' as const },
  suspended: { label: '정지', variant: 'destructive' as const },
};

export function PeermallManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [peermalls] = useState(mockPeermalls);

  const filteredPeermalls = peermalls.filter(peermall =>
    peermall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    peermall.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (peermallId: string) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit peermall:', peermallId);
  };

  const handleDelete = (peermallId: string) => {
    // TODO: Show confirmation dialog and delete peermall
    console.log('Delete peermall:', peermallId);
  };

  const handleCreate = () => {
    // TODO: Navigate to create page
    console.log('Create new peermall');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">피어몰 관리</h2>
          <p className="text-muted-foreground">
            등록된 피어몰을 관리하고 편집하세요.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          새 피어몰 등록
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 피어몰</p>
                <p className="text-2xl font-bold">{peermalls.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 팔로워</p>
                <p className="text-2xl font-bold">
                  {formatNumber(peermalls.reduce((sum, p) => sum + p.followerCount, 0))}명
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
                <p className="text-sm font-medium text-muted-foreground">총 매출</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(peermalls.reduce((sum, p) => sum + p.salesVolume, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>피어몰 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="피어몰 이름 또는 URL로 검색..."
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
                  <TableHead>피어몰 정보</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>팔로워</TableHead>
                  <TableHead>매출</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeermalls.map((peermall) => (
                  <TableRow key={peermall.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{peermall.name}</div>
                        <div className="text-sm text-muted-foreground">
                          /{peermall.url}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusLabels[peermall.status].variant}>
                        {statusLabels[peermall.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatNumber(peermall.followerCount)}명</TableCell>
                    <TableCell>{formatCurrency(peermall.salesVolume)}</TableCell>
                    <TableCell>{peermall.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(peermall.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(peermall.id)}
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

          {filteredPeermalls.length === 0 && (
            <div className="text-center py-12">
              <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 피어몰이 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
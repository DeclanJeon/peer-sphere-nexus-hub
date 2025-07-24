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
  Calendar,
  Users,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// TODO: Replace with actual API data
const mockEvents = [
  {
    id: '1',
    title: '신제품 런칭 이벤트',
    content: '새로 출시되는 프리미엄 라인 제품들을 특별가로 만나보세요!',
    category: '신제품',
    peermallName: '김민수의 뷰티샵',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    participants: 156,
    views: 2340,
    status: 'ongoing' as const,
    createdAt: '2024-02-25',
  },
  {
    id: '2',
    title: '봄맞이 할인 이벤트',
    content: '봄을 맞아 모든 상품 최대 30% 할인 혜택을 드립니다.',
    category: '할인',
    peermallName: '테크 가젯 스토어',
    startDate: '2024-03-20',
    endDate: '2024-04-05',
    participants: 89,
    views: 1890,
    status: 'upcoming' as const,
    createdAt: '2024-02-28',
  },
  {
    id: '3',
    title: '고객 감사 이벤트',
    content: '항상 저희를 사랑해주시는 고객님들께 감사의 마음을 전합니다.',
    category: '감사',
    peermallName: '김민수의 뷰티샵',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    participants: 234,
    views: 3456,
    status: 'ended' as const,
    createdAt: '2024-01-28',
  },
];

const statusLabels = {
  ongoing: { label: '진행중', variant: 'default' as const },
  upcoming: { label: '예정', variant: 'secondary' as const },
  ended: { label: '종료', variant: 'outline' as const },
};

export function EventManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [events] = useState(mockEvents);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.peermallName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (eventId: string) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit event:', eventId);
  };

  const handleDelete = (eventId: string) => {
    // TODO: Show confirmation dialog and delete event
    console.log('Delete event:', eventId);
  };

  const handleCreate = () => {
    // TODO: Navigate to create page
    console.log('Create new event');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getEventsByStatus = (status: string) => {
    return events.filter(event => event.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">이벤트 관리</h2>
          <p className="text-muted-foreground">
            등록한 이벤트를 관리하고 편집하세요.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          새 이벤트 등록
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 이벤트</p>
                <p className="text-2xl font-bold">{events.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">진행중</p>
                <p className="text-2xl font-bold">{getEventsByStatus('ongoing')}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">예정</p>
                <p className="text-2xl font-bold">{getEventsByStatus('upcoming')}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 참여자</p>
                <p className="text-2xl font-bold">
                  {formatNumber(events.reduce((sum, e) => sum + e.participants, 0))}명
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>이벤트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이벤트명, 카테고리 또는 피어몰로 검색..."
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
                  <TableHead>이벤트 정보</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>피어몰</TableHead>
                  <TableHead>기간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>참여/조회</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium mb-1">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {truncateText(event.content, 50)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{event.peermallName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(event.startDate)}</div>
                        <div className="text-muted-foreground">
                          ~ {formatDate(event.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusLabels[event.status].variant}>
                        {statusLabels[event.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>참여 {formatNumber(event.participants)}명</div>
                        <div className="text-muted-foreground">
                          조회 {formatNumber(event.views)}회
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(event.id)}
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

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '등록한 이벤트가 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
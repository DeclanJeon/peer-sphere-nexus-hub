// src/components/admin/EventApplicationHistory.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventApplication } from '@/types/sponsor';
import { eventApi } from '@/services/event.api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const EventApplicationHistory = () => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplicationHistory = async () => {
      if (!user) return;
      
      try {
        const data = await eventApi.getEventApplicationHistory(user.user_uid);
        setApplications(data);
      } catch (error) {
        console.error('신청 히스토리 조회 실패:', error);
        toast({
          title: '오류',
          description: '신청 히스토리를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationHistory();
  }, [user]);

  const getStatusBadge = (status: EventApplication['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">거절됨</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          이벤트 신청 히스토리
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            신청한 이벤트가 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{application.eventTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {application.sponsorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {application.userName}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    신청일: {format(new Date(application.appliedAt), 'yyyy년 M월 d일 HH:mm', { locale: ko })}
                  </span>
                  {application.processedAt && (
                    <span>
                      처리일: {format(new Date(application.processedAt), 'yyyy년 M월 d일 HH:mm', { locale: ko })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventApplicationHistory;
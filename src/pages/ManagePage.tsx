// src/pages/ManagePage.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventApplicationHistory from '@/components/admin/EventApplicationHistory';
import { Calendar, User, Settings } from 'lucide-react';

const ManagePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="text-muted-foreground mt-2">
          계정 정보와 이벤트 신청 내역을 관리하세요.
        </p>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            이벤트 신청 내역
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            프로필 설정
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            계정 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <EventApplicationHistory />
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                프로필 설정 기능이 준비 중입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>계정 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                계정 설정 기능이 준비 중입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagePage;
// src/services/event.api.ts
import apiClient from '@/lib/api/clients';
import {
  EventBase,
  CreateEventPayload,
  UpdateEventPayload,
} from '@/types/event';

class EventApi {
  private basePath = '/events';

  async getAllEvents(): Promise<EventBase[]> {
    const response = await apiClient.get(`${this.basePath}/all`);
    return response.data.data;
  }

  async getEventsByPeermallId(peermallId: string): Promise<EventBase[]> {
    const response = await apiClient.get(
      `${this.basePath}/peermall/${peermallId}`
    );
    return response.data.data;
  }

  async createEvent(eventData: FormData): Promise<EventBase> {
    const isFormData = eventData instanceof FormData;
    const response = await apiClient.post(
      `${this.basePath}/create`,
      eventData,
      {
        headers: isFormData
          ? {
              'Content-Type': 'multipart/form-data',
            }
          : {
              'Content-Type': 'application/json',
            },
      }
    );

    console.log(response);

    return response.data.data;
  }

  async getEventById(eventId: string): Promise<EventBase> {
    const response = await apiClient.get(`${this.basePath}/${eventId}`);
    return response.data.data;
  }

  async updateEvent(
    eventId: string,
    eventData: UpdateEventPayload
  ): Promise<EventBase> {
    const response = await apiClient.patch(
      `${this.basePath}/${eventId}`,
      eventData
    );
    return response.data.data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${eventId}`);
  }

  // 사용자별 개인화된 이벤트 조회
  async getEventsForUser(userId: string): Promise<EventBase[]> {
    // TODO: 백엔드 API 연동 필요 - 사용자의 스폰서에 맞춘 이벤트 반환
    // const response = await apiClient.get(`${this.basePath}/user/${userId}`);
    // return response.data.data;
    
    // 더미 데이터로 모든 이벤트 반환
    return this.getAllEvents();
  }

  // 이벤트 신청
  async applyForEvent(eventId: string, userId: string): Promise<{ success: boolean; message: string }> {
    // TODO: 백엔드 API 연동 필요
    // 1. 신청 내역을 데이터베이스에 저장
    // 2. 승인/거절용 고유 토큰 생성
    // 3. 이벤트 주최자에게 승인 요청 이메일 발송
    // 승인 링크: https://api.yourdomain.com/event-applications/decide?token={고유_토큰}&action=approve
    // 거절 링크: https://api.yourdomain.com/event-applications/decide?token={고유_토큰}&action=reject
    
    console.log(`User ${userId} applied for event ${eventId}`);
    
    // 더미 응답
    return {
      success: true,
      message: '신청이 완료되었습니다. 주최자의 승인을 기다려주세요.'
    };
  }

  // 이벤트 신청 히스토리 조회
  async getEventApplicationHistory(userId: string): Promise<any[]> {
    // TODO: 백엔드 API 연동 필요
    // const response = await apiClient.get(`${this.basePath}/applications/user/${userId}`);
    // return response.data.data;
    
    // 더미 데이터 사용
    const applicationData = await import('@/seeds/eventApplications.json');
    return applicationData.applications.filter(app => app.userId === userId);
  }

  // 이벤트 신청 승인/거절 처리 (관리자용)
  async processEventApplication(token: string, action: 'approve' | 'reject'): Promise<{ success: boolean; message: string }> {
    // TODO: 백엔드 API 연동 필요
    // 1. 토큰 검증 및 신청 내역 조회
    // 2. 상태를 '승인됨' 또는 '거절됨'으로 업데이트
    // 3. 사용된 토큰 만료 처리
    // 4. 사용자에게 결과 통보 이메일 발송
    
    console.log(`Processing application with token ${token}, action: ${action}`);
    
    return {
      success: true,
      message: `신청이 ${action === 'approve' ? '승인' : '거절'}되었습니다.`
    };
  }
}

export const eventApi = new EventApi();

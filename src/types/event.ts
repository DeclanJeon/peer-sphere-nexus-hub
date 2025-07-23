// src/types/event.ts

/**
 * 백엔드 API와 통신하기 위한 기본 이벤트 데이터 구조입니다.
 * 데이터베이스 스키마와 일치합니다.
 */
export interface EventBase {
  peermall_url: string;
  id: string; // 데이터베이스에서는 INT지만, API 통신 시 문자열로 변환될 수 있으므로 string으로 통일
  peermall_id: string;
  user_uid?: string;
  title: string;
  content: string;
  event_start_date: string; // YYYY-MM-DD 형식의 문자열
  event_end_date: string; // YYYY-MM-DD 형식의 문자열
  image_url?: string;
  category?: string;
  views?: number;
  participants?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 프론트엔드에서 사용하기 위해 동적으로 계산된 상태를 포함하는 확장된 이벤트 타입입니다.
 */
export interface Event extends EventBase {
  status: 'ongoing' | 'upcoming' | 'ended';
  dDay: number; // D-day 계산 결과
}

/**
 * 이벤트 생성을 위한 API 요청 본문(payload) 타입입니다.
 * id와 같이 서버에서 생성되는 필드는 제외됩니다.
 */
export type CreateEventPayload = Omit<
  EventBase,
  'id' | 'user_uid' | 'views' | 'participants' | 'created_at' | 'updated_at'
>;

/**
 * 이벤트 수정을 위한 API 요청 본문(payload) 타입입니다.
 * 모든 필드는 선택적으로 전송될 수 있습니다.
 */
export type UpdateEventPayload = Partial<CreateEventPayload>;

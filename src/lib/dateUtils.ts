import { Event, EventBase } from '@/types/event';

/**
 * 이벤트의 상태(진행중, 예정, 종료)와 D-day를 계산합니다.
 * @param eventStartDate - 이벤트 시작일 (YYYY-MM-DD 형식 문자열)
 * @param eventEndDate - 이벤트 종료일 (YYYY-MM-DD 형식 문자열)
 * @returns { status, dDay } 객체
 */
export const calculateEventStatus = (
  eventStartDate: string,
  eventEndDate: string
): { status: 'ongoing' | 'upcoming' | 'ended'; dDay: number } => {
  const now = new Date();
  const startDate = new Date(eventStartDate);
  const endDate = new Date(eventEndDate);

  // 시간 정보를 제거하고 날짜만 비교하기 위해 UTC 자정으로 설정
  now.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let status: 'ongoing' | 'upcoming' | 'ended';
  let dDay = 0;

  if (now < startDate) {
    status = 'upcoming';
    // 시작일까지 남은 일수
    dDay = Math.ceil(
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  } else if (now > endDate) {
    status = 'ended';
    dDay = 0; // 종료된 이벤트는 D-day가 의미 없음
  } else {
    status = 'ongoing';
    // 종료일까지 남은 일수
    dDay = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return { status, dDay };
};

/**
 * 백엔드에서 받은 EventBase 객체에 status와 dDay를 추가하여
 * 프론트엔드용 Event 객체로 변환합니다.
 * @param event - 백엔드에서 받은 기본 이벤트 객체
 * @returns 프론트엔드용으로 확장된 이벤트 객체
 */
export const processEventData = (event: EventBase): Event => {
  const { status, dDay } = calculateEventStatus(
    event.event_start_date,
    event.event_end_date
  );
  return {
    ...event,
    image_url: event.image_url, // 필드명 일관성 유지
    status,
    dDay,
  };
};

import {
  ChatRequest,
  ChatResponse,
  GroupedMessagesByDate,
} from '../type/chat/chat';
import { ChatType } from '../type/chat/chatEnums';

export const createMsgForMsg = (
  chatType: ChatType.MESSAGE,
  roomId: number,
  content: string
): ChatRequest => {
  return {
    roomId,
    chatType,
    content,
  };
};

export const createMsgForImage = (
  chatType: ChatType.IMAGE,
  roomId: number,
  images: string[],
  content?: string
): ChatRequest => {
  return {
    roomId,
    chatType,
    content,
    images,
  };
};

export const createMsgForBook = (
  chatType: ChatType.EVENT_BOOK,
  roomId: number,
  targetId: number,
  isDone: boolean,
): ChatRequest => {
  return {
    roomId,
    chatType,
    targetId,
    isDone,
  };
};
export const createMsgForEnd = (
  chatType: ChatType.EVENT_END,
  roomId: number,
  targetId: number,
  isDone: boolean,
): ChatRequest => {
  return {
    roomId,
    chatType,
    targetId,
    isDone
  };
};

export const createMsgForCancel = (
    chatType: ChatType.EVENT_CANCEL,
    roomId: number,
    targetId: number,
): ChatRequest => {
  return {
    roomId,
    chatType,
    targetId,
  };
};


export function groupMessagesByDate(
  messages: ChatResponse[]
): GroupedMessagesByDate {
  // `as GroupedMessagesByDate`를 사용하여 `grouped` 객체의 초기 타입을 명시
  const grouped: GroupedMessagesByDate = {};

  messages.forEach((message) => {
    // 1. createdAt 문자열을 Date 객체로 변환
    // message.createdAt은 string 타입이므로 Date 생성자로 파싱 가능
    const dateObject = new Date(message.createdAt);

    // Date 객체가 유효한지 확인 (선택 사항이지만 안전성 증대)
    // 잘못된 날짜 문자열이 들어올 경우 'Invalid Date'가 될 수 있음
    if (isNaN(dateObject.getTime())) {
      console.warn(
        `Invalid date format for message.createdAt: ${message.createdAt}. Skipping message.`,
        message
      );
      return; // 유효하지 않은 날짜는 건너뛰기
    }

    // 2. Date 객체에서 '년-월-일' 형식의 날짜 문자열을 추출하여 키로 사용
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자리로 포맷팅
    const day = String(dateObject.getDate()).padStart(2, '0'); // 두 자리로 포맷팅

    const dateKey = `${year}-${month}-${day}`; // 예: "2025-07-01"

    // 3. 해당 날짜 키에 메시지 배열이 없으면 새로 생성
    // TypeScript는 `grouped[dateKey]`가 `undefined`일 수 있음을 알고 있기 때문에
    // `!` (non-null assertion operator)를 사용하거나 `??=` 연산자를 사용하여 안전하게 접근합니다.
    grouped[dateKey] = grouped[dateKey] || []; // 또는 `grouped[dateKey] ??= [];`

    // 4. 해당 날짜 키의 배열에 현재 메시지를 추가
    grouped[dateKey].push(message);
  });

  return grouped;
}

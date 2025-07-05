import {ChatType, RoomProgressEnum} from './chatEnums';

export interface ChatDefaultPageRequest {
  size: number;
  page: number;
}

export interface ChatRequest {
  roomId: number;
  chatType: ChatType;
  content?: string;
  images?: string[];
  targetId?: number;
}

export interface ChatDefaultPageResponse {
  currentPage: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface ChatExceptionResponse {
  status: number;
  code: string;
  message: string;
  errors: {
    [key: string]: string;
  };
}

export interface ChatCommonResponse<T> {
  success: boolean;
  data: T;
  error: ChatExceptionResponse;
}

export interface ChatListPageResponse extends ChatDefaultPageResponse {
  rooms: ChatListSingleResponse[];
}

export interface ChatListSingleResponse {
  userNickname: string;
  lastChatTime: string;
  lastChat: ChatResponse;
  roomId: number;
  unreadCount: number;
  userId: number;
}

export interface ChatResponse {
  chatId: number;
  roomId: number;
  senderId: number;
  content: string;
  createdAt: string;
  chatType: ChatType;
  targetId?: string;
  images?: string[];
  post?: ChatPostResponse;
  isEventDone?: boolean;
}

export interface ChatPageResponse extends ChatDefaultPageResponse {
  roomId: number;
  content: ChatResponse[];
}

export interface ChatRoomRequest {
  targetUserId: number;
}

export interface ChatRoomResponse {
  roomId: number;
  targetUserId: number;
  targetUserNickname: string;
}

export interface GroupedMessagesByDate {
  [date: string]: ChatResponse[]; // 키는 string(날짜), 값은 ChatResponse 배열
}
export type ChatPostStatus = 'SELLING' | 'BOOKED' | 'END';

export type ChatPostResponse = {
  id: number;
  title: string;
  price: number;
  content: string;
  postStatus: ChatPostStatus;
  productCategory:
    | 'DIGITAL_DEVICE'
    | 'HOME_APPLIANCE'
    | 'FURNITURE'
    | 'KITCHEN'
    | 'KIDS';
  createdAt: string;
  updatedAt: string;
  userId: number;
  nickname: string;
  images?: string[];
};

export  type ChatRoomInfoResponse = {
  roomId: number;
  targetPost: ChatPostResponse;
  requestUserId: number;
  roomProgress: RoomProgressEnum
}

export type ChatUserSellingResponse = {
  targetUserId: number;
  posts: ChatPostResponse[];
}
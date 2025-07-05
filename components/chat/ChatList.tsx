'use client';

import { axiosGet } from '@/utils/api/chat/chatApi';
import { groupMessagesByDate } from '@/utils/chatUtils/chatMessageUtils';
import {
  ChatCommonResponse,
  ChatDefaultPageRequest,
  ChatDefaultPageResponse,
  ChatPageResponse,
  ChatResponse,
} from '@/utils/type/chat/chat';
import { useEffect, useRef, useState } from 'react';
import ChatListDateByDate from './ChatListDateByDate';

type Props = {
  newChats: ChatResponse[];
  roomId: number;
  reset: () => void;
};

const ChatList = ({ newChats, roomId, reset }: Props) => {
  const [pageInfo, setPageInfo] = useState<ChatDefaultPageResponse>();
  const [chatList, setChatList] = useState<ChatResponse[]>([]);

  const [isFirstChat, setIsFirstChat] = useState(false);
  const [dateKeys, setDateKeys] = useState<string[]>([]);

  if (isFirstChat && newChats.length > 0) {
    setIsFirstChat(false);
    setChatList(newChats);

    const newChatListByDate = groupMessagesByDate(newChats);
    const sortedDateKeys = Object.keys(newChatListByDate).sort();
    setDateKeys(sortedDateKeys);

    reset();
  }

  const highestChatIdRef = useRef<number>(null);

  console.log(pageInfo);

  const chatListByDate =
    chatList.length > 0 ? groupMessagesByDate(chatList) : undefined;

  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchData = async (page: number) => {
    console.log('fetchData called');
    console.log('fetchData called');
    console.log('fetchData called');
    console.log('fetchData called');

    const data = await axiosGet<
      ChatCommonResponse<ChatPageResponse>,
      ChatDefaultPageRequest
    >(`/chat/${roomId}`, { page, size: 100 });

    const { content, currentPage, size, totalElements, totalPages } = data.data;

    console.log(content);
    if (content && content.length > 0) {
      if (highestChatIdRef.current) {
        if (highestChatIdRef.current > content[0].chatId)
          highestChatIdRef.current = content[0].chatId;
      } else {
        highestChatIdRef.current = content[0].chatId;
      }
    }

    setChatList((prev) => {
      const newChatList = [...prev, ...content];
      const newChatListByDate = groupMessagesByDate(newChatList);

      const sortedDateKeys = Object.keys(newChatListByDate).sort();
      setDateKeys(sortedDateKeys);

      return newChatList;
    });
    setPageInfo({ currentPage, size, totalElements, totalPages });

    return content.length == 0;
  };

  const getPreviousPage = () => {
    if (pageInfo) {
      fetchData(pageInfo.currentPage + 1);
    }
  };

  useEffect(() => {
    if (highestChatIdRef.current) {
      axiosGet(`/chat/room/${roomId}/chat/${highestChatIdRef.current}`);
    }
  }, [highestChatIdRef.current]);

  useEffect(() => {
    setTimeout(() => {
      if (chatScrollContainerRef.current) {
        const scrollHeight = chatScrollContainerRef.current.scrollHeight;

        chatScrollContainerRef.current.scrollTop = scrollHeight;
      }
    }, 200);
  }, [chatScrollContainerRef.current, newChats]);

  useEffect(() => {
    const main = async () => {
      const isFirst = await fetchData(0);
      if (isFirst) {
        setPageInfo(undefined);
        setChatList([]);
        setDateKeys([]);
        setIsFirstChat(true);
      }
    };

    main();
  }, []);

  return (
    <div
      ref={chatScrollContainerRef}
      id="chatListWrapper"
      className="overflow-x-hidden w-full bg-[#F7F9FC] rounded-xl shadow-lg-custom flex flex-col flex-grow           overflow-y-auto max-h-[calc(100vh-200px)]           [&::-webkit-scrollbar]:w-[8px]  [&::-webkit-scrollbar]:h-[0px]  [&::-webkit-scrollbar-track]:bg-[#eef1f5]  [&::-webkit-scrollbar-thumb]:bg-[#d3d1cb]  [&::-webkit-scrollbar-thumb]:rounded-full   [&::-webkit-scrollbar-thumb:hover]:bg-[#9c9b98]"
    >
      {pageInfo && pageInfo.currentPage + 1 < pageInfo.totalPages && (
        <div className="flex justify-center w-full my-4">
          <div
            onClick={getPreviousPage}
            className="inline-flex items-center justify-center px-4 py-2    bg-gray-200 text-gray-800 rounded-lg shadow-sm    text-sm font-medium mx-auto    cursor-pointer     transition-all duration-200 ease-in-out     hover:bg-gray-300     hover:-translate-y-0.5     hover:shadow-md             "
          >
            ⬆ 이전 채팅 불러오기
          </div>
        </div>
      )}

      {pageInfo && pageInfo.currentPage + 1 >= pageInfo.totalPages && (
        <div className="flex justify-center w-full my-4">
          <div className="inline-flex items-center justify-center px-4 py-2    bg-gray-200 text-gray-800 rounded-lg shadow-sm    text-sm font-medium mx-auto    cursor-pointer     transition-all duration-200 ease-in-out     hover:bg-gray-300     hover:-translate-y-0.5     hover:shadow-md             ">
            이전 채팅이 없어요
          </div>
        </div>
      )}

      {dateKeys.map((dateKey, index) => {
        const chatsByDate = chatListByDate![dateKey].reverse();

        return (
          <ChatListDateByDate
            newchats={dateKeys.length - 1 === index ? newChats : undefined}
            date={dateKey}
            key={'dateKey' + chatsByDate.length}
            chats={chatsByDate}
          />
        );
      })}
    </div>
  );
};

export default ChatList;

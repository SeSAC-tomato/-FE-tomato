'use client';

import { ChatResponse } from '@/utils/type/chat/chat';
import ChatDate from './ChatDate';
import ChatSingle from './ChatSingle';
import {useAuthStore} from "@/store/useAuthStore";

type Props = {
  chats: ChatResponse[];
  date: string;
  newchats?: ChatResponse[];
};

const ChatListDateByDate = ({
  chats,
  date,
  newchats,
}: //상품관련정보 필요
Props) => {

    const testUser =useAuthStore(state => state.testUser)


  return (
    <>
      <ChatDate date={date} key={date} />
      <div className="p-[15px]  flex flex-col gap-3 flex-grow  ">
        {chats.map((chat) => {
          return (
            <ChatSingle
              chat={chat}
              key={chat.chatId}
              isMine={chat.senderId == testUser!.userId}
            />
          );
        })}

        {newchats &&
          newchats.length > 0 &&
          newchats.map((chat) => {
            return (
              <ChatSingle
                chat={chat}
                key={chat.chatId}
                isMine={chat.senderId == testUser!.userId}
              />
            );
          })}
      </div>
    </>
  );
};

export default ChatListDateByDate;

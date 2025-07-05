'use client';

import { convertDate } from '@/utils/chatUtils/dateUtils';
import { decodeHtml } from '@/utils/chatUtils/htmlUtils';
import { ChatListSingleResponse } from '@/utils/type/chat/chat';
import AddImageIcon from '../icons/chat/AddImageIcon';

type Props = {
  room: ChatListSingleResponse;
  isLast: boolean;
  openModal: () => void;
};

function Room({ room, isLast, openModal }: Props) {
  console.log(isLast);

  return (
    <div
      onClick={openModal}
      className={`flex items-center py-4 px-6 transition-all duration-200 ease-in-out cursor-pointer relative hover:bg-[#f9f9f9] hover:translate-y-[-1px] hover:shadow-md hover:z-10 ${
        !isLast ? 'border-b border-[#f5f5f5]' : ''
      }`}
    >
      <div className="grow-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-lg text-[#33333] whitespace-nowrap overflow-hidden overflow-ellipsis mr-2.5">
            {room.userNickname}
          </span>
          <span className="text-xs text-[#999999] shrink-0">
            {convertDate(room.lastChatTime)}
          </span>
        </div>
        <div className="flex items-center">
          {room.lastChat && room.lastChat.images && <AddImageIcon size={20} />}
          {room.lastChat && room.lastChat.content && (
            <p className="pl-3 text-xs text-[#666666] whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[calc(100%-30px)] leading-[1.3]">
              {decodeHtml(room.lastChat.content)}
            </p>
          )}
        </div>
      </div>
      {room.unreadCount > 0 && (
        <div className="bg-[#ff4d4f] text-white text-[0.75em] font-bold w-6 h-6 rounded-full flex justify-center items-center ml-5 flex-shrink-0">
          {room.unreadCount}
        </div>
      )}
    </div>
  );
}

export default Room;

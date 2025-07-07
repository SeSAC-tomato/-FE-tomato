'use client';

import {useAuthStore} from '@/store/useAuthStore';
import {formatTimeAmPm} from '@/utils/chatUtils/dateUtils';
import {decodeHtml} from '@/utils/chatUtils/htmlUtils';
import {ChatResponse} from '@/utils/type/chat/chat';
import {ChatType} from '@/utils/type/chat/chatEnums';
import ChatPostInfo from "@/components/chat/ChatPostInfo";
import {getChatImageUrl} from "@/utils/chatUtils/constants";

type Props = {
    chat: ChatResponse;
    isMine: boolean;
};

const ChatSingle = ({chat, isMine}: Props) => {
    const user = useAuthStore((state) => state.testUser);

    isMine = chat.senderId == user?.userId;

    return (
        <>
            {chat.chatType != ChatType.IMAGE && (
                <ChatSingleMessage
                    chat={chat}
                    chatType={chat.chatType}
                    isMine={isMine}
                    key={chat.chatId}
                />
            )}
            {chat.chatType == ChatType.IMAGE && (
                <ChatSingleImage
                    chat={chat}
                    chatType={chat.chatType}
                    isMine={isMine}
                    key={chat.chatId}
                />
            )}
        </>
    );
};

type ChatSingleMessageProps = {
    chat: ChatResponse;
    isMine: boolean;
    chatType: ChatType;
};

const ChatSingleMessage = ({
                               chat,
                               isMine,
                               chatType,
                           }: ChatSingleMessageProps) => {
    return (
        <>
            {isMine && (
                <div
                    className="max-w-[75%] p-2.5 px-[15px] rounded-2xl relative break-words shadow-sm leading-snug text-[0.95em]
            self-end bg-[#DCF8C6] text-[#333] rounded-br-md"
                >
                    {chat.chatType != ChatType.MESSAGE && chat.post && <ChatPostInfo post={chat.post}/>}
                    <p className="m-0 whitespace-pre-wrap">
                        {chatType == ChatType.EVENT_BOOK && "📅 "}
                        {chatType == ChatType.EVENT_END && "✅ "}
                        {chatType == ChatType.EVENT_CANCEL && "✖️ "}

                        {chatType == ChatType.MESSAGE && `${decodeHtml(chat.content)}`}
                        {chatType != ChatType.MESSAGE &&
                            <span className="font-semibold">{decodeHtml(chat.content)}</span>}

                    </p>
                    <span className="block text-[0.7em] text-[#8899AA] mt-1.5 text-right">
            {formatTimeAmPm(chat.createdAt)}
          </span>
                </div>
            )}
            {!isMine && (
                <div
                    className="max-w-[75%] p-2.5 px-[15px] rounded-2xl relative break-words shadow-sm leading-snug text-[0.95em]
            self-start bg-white text-[#333] border border-[#e0e0e0] rounded-bl-md"
                >
                    {chat.chatType != ChatType.MESSAGE&& chat.post && <ChatPostInfo post={chat.post}/>}
                    <p className="m-0 whitespace-pre-wrap">
                        {chatType == ChatType.EVENT_BOOK && "📅 "}
                        {chatType == ChatType.EVENT_END && "✅ "}
                        {chatType == ChatType.EVENT_CANCEL && "✖️ "}

                        {chatType == ChatType.MESSAGE && `${decodeHtml(chat.content)}`}
                        {chatType != ChatType.MESSAGE &&
                            <span className="font-semibold">{decodeHtml(chat.content)}</span>}
                    </p>
                    <span className="block text-[0.7em] text-[#8899AA] mt-1.5 text-left">
            {formatTimeAmPm(chat.createdAt)}
          </span>
                </div>
            )}
        </>
    );
};

type ChatSingleImageProps = {
    chat: ChatResponse;
    isMine: boolean;
    chatType: ChatType.IMAGE;
};

const ChatSingleImage = ({chat, isMine, chatType}: ChatSingleImageProps) => {
    return (
        <>
            {isMine && chatType == ChatType.IMAGE && (
                <div
                    className="max-w-[75%] p-2.5 px-[15px] rounded-2xl relative break-words shadow-sm leading-snug text-[0.95em]
            self-end bg-[#DCF8C6] text-[#333] rounded-br-md"
                >
                    {chat.images && chat.images.length > 0 && (
                        <a
                            href={getChatImageUrl(chat.images[0])}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={
                                    getChatImageUrl(chat.images[0])
                                }
                                alt="alt"
                            />
                        </a>
                    )}

                    <p className="m-0 whitespace-pre-wrap">{decodeHtml(chat.content)}</p>
                    <span className="block text-[0.7em] text-[#8899AA] mt-1.5 text-right">
            {formatTimeAmPm(chat.createdAt)}
          </span>
                </div>
            )}
            {!isMine && chatType == ChatType.IMAGE && (
                <div
                    className="max-w-[75%] p-2.5 px-[15px] rounded-2xl relative break-words shadow-sm leading-snug text-[0.95em]
            self-start bg-white text-[#333] border border-[#e0e0e0] rounded-bl-md"
                >
                    {chat.images && chat.images.length > 0 && (
                        <a
                            href={getChatImageUrl(chat.images[0])}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={
                                    getChatImageUrl(chat.images[0])
                                }
                                alt="alt"
                            />
                        </a>
                    )}
                    <p className="m-0 whitespace-pre-wrap">{decodeHtml(chat.content)}</p>
                    <span className="block text-[0.7em] text-[#8899AA] mt-1.5 text-left">
            {formatTimeAmPm(chat.createdAt)}
          </span>
                </div>
            )}
        </>
    );
};


export default ChatSingle;

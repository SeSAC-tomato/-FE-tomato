'use client';
import {
    createMsgForBook, createMsgForCancel, createMsgForEnd,
    createMsgForImage,
    createMsgForMsg,
} from '@/utils/chatUtils/chatMessageUtils';
import {
    blobToBase64,
    resizeAndCompressImage,
} from '@/utils/chatUtils/imageUtils';
import {ChatType} from '@/utils/type/chat/chatEnums';
import {Client} from '@stomp/stompjs';
import React, {useRef, useState} from 'react';
import MinusIcon from '../icons/chat/MinusIcon';
import PlusIcon from '../icons/chat/PlusIcon';
import SendIcon from '../icons/chat/SendIcon';
import ChatImagePreview from './ChatImagePreview';
import ChatSelectBox from './ChatSelectBox';
import {getWebsocketPubRoom} from "@/utils/chatUtils/constants";

type Props = {
    roomId: number;
    stompClientRef: React.RefObject<Client | null>;
    userId: number;
};

const ChatMessageInput = ({roomId, stompClientRef, userId}: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [chatTypeMode, setChatTypeMode] = useState<ChatType>(ChatType.MESSAGE);
    const [selectBoxActive, setSelectBoxActive] = useState(false);

    const [encodedImage, setEncodedImage] = useState<string>();
    const [imagePreview, setImagePreview] = useState<string>();

    const changeMode = (chatType: ChatType) => {
        setChatTypeMode(chatType);
        setSelectBoxActive(false);
    };

    const sendMessage = (chatType: ChatType, isDone?: boolean, targetId?: number) => {
        let messageObject;

        if (chatType == ChatType.EVENT_BOOK && targetId && isDone != undefined) {
            messageObject = createMsgForBook(chatType, roomId, targetId, isDone);
        }
        if (chatType == ChatType.EVENT_END && targetId && isDone != undefined) {
            messageObject = createMsgForEnd(chatType, roomId, targetId, isDone);
        }
        if (chatType == ChatType.EVENT_CANCEL && targetId) {
            messageObject = createMsgForCancel(chatType, roomId, targetId);

        }


        if (chatType == ChatType.MESSAGE) {
            if (textareaRef.current) {
                if (textareaRef.current.value)
                    messageObject = createMsgForMsg(
                        chatType,
                        roomId,
                        textareaRef.current.value
                    );
            }
        }

        if (chatType == ChatType.IMAGE) {
            if (encodedImage)
                messageObject = createMsgForImage(
                    chatType,
                    roomId,
                    [encodedImage],
                    textareaRef.current?.value
                );
        }

        if (!messageObject) {
            alert("잘못된 요청")
            return
        }

        textareaRef.current!.value = '';
        console.log('🔽 publish 직전');
        try {
            stompClientRef.current!.publish({
                destination: getWebsocketPubRoom(roomId),
                body: JSON.stringify(messageObject),
            });
            console.log('✅ publish 이후 코드 실행됨');
        } catch (e) {
            console.error('❌ publish 오류:', e);
        }
        console.log('🔽 publish 함수 끝');

        setImagePreview(undefined);
        setEncodedImage(undefined);
        setChatTypeMode(ChatType.MESSAGE);
        setSelectBoxActive(false);
    };

    // 파일 선택 후 처리
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            await resizeAndCompressImage(file)
                .then((blob) => blobToBase64(blob))
                .then((encoded) =>
                    setEncodedImage(() => {
                        return encoded;
                    })
                );

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImagePreview(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <input
                type="file"
                id="chat-file-upload"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
            {imagePreview && (
                <ChatImagePreview
                    undo={() => {
                        changeMode(ChatType.MESSAGE);
                        setEncodedImage(undefined);
                        setImagePreview(undefined);
                    }}
                    imagePreviews={imagePreview}
                />
            )}
            {selectBoxActive && (
                <ChatSelectBox sendMessage={sendMessage}
                               roomId={roomId} changeMode={changeMode} userId={userId}/>
            )}
            <div
                className="bg-white border-t border-[#eef1f5] p-2.5 px-[15px] flex items-end gap-2.5 rounded-b-xl shadow-input-bottom flex-shrink-0">
        <textarea
            ref={textareaRef}
            className="flex-grow p-3 px-[15px] border border-[#dcdfe6] rounded-xl text-[0.95em] min-h-[94px] resize-none overflow-hidden leading-snug font-sans             placeholder:text-[#aebacd]             focus:outline-none focus:border-[#5d9cec] focus:ring-3 focus:ring-[#5d9cec]/20"
            placeholder="메시지를 입력하세요..."
        ></textarea>
                <div id="message-input-buttons" className="flex gap-1.5 flex-col">
                    {!selectBoxActive && (
                        <button
                            disabled={!!imagePreview}
                            onClick={() => {
                                setSelectBoxActive(true);
                            }}
                            className="disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed  bg-[#5d9cec] text-white border-none rounded-full w-11 h-11 flex justify-center items-center text-lg cursor-pointer transition-colors duration-200 ease-in-out transform-gpu flex-shrink-0   hover:bg-[#4a8ae6] hover:-translate-y-px  active:translate-y-0"
                        >
                            <PlusIcon className="w-6 h-6 text-white"/>
                        </button>
                    )}
                    {selectBoxActive && (
                        <button
                            onClick={() => setSelectBoxActive(false)}
                            className="  bg-[#5d9cec] text-white border-none rounded-full w-11 h-11 flex justify-center items-center text-lg cursor-pointer transition-colors duration-200 ease-in-out transform-gpu flex-shrink-0   hover:bg-[#4a8ae6] hover:-translate-y-px  active:translate-y-0"
                        >
                            <MinusIcon className="w-6 h-6 text-white"/>
                        </button>
                    )}
                    <button
                        onClick={() => sendMessage(chatTypeMode)}
                        className="bg-[#5d9cec] text-white border-none rounded-full w-11 h-11 flex justify-center items-center text-lg cursor-pointer transition-colors duration-200 ease-in-out transform-gpu flex-shrink-0             hover:bg-[#4a8ae6] hover:-translate-y-px             active:translate-y-0"
                    >
                        <SendIcon className="w-5 h-5 text-white"/>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatMessageInput;

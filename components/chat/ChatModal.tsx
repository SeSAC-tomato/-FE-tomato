'use client';

import {useAuthStore} from '@/store/useAuthStore';
import {axiosGet} from '@/utils/api/chat/chatApi';
import {ChatResponse} from '@/utils/type/chat/chat';
import {Client} from '@stomp/stompjs';
import {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import SockJS from 'sockjs-client';
import ChatBubbleIcon from '../icons/chat/ChatBubbleIcon';
import XIcon from '../icons/chat/XIcon';
import ChatList from './ChatList';
import ChatMessageInput from './ChatMessageInput';

type Props = {
    roomId: number;
    onClose: () => void;
    nickname: string;
    userId: number;
};

const ChatModal = ({roomId, nickname, onClose, userId}: Props) => {
    const [newChats, setNewChats] = useState<ChatResponse[]>([]);
    const stompClientRef = useRef<Client>(null);

    const user = useAuthStore((state) => state.testUser);
    const token = useAuthStore((state) => state.accessToken);

    const closeModal = () => {
        onClose();
    };

    useEffect(() => {
        const connectToWebSocket = (token: string, email: string) => {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const stompClient = new Client({
                connectHeaders: headers,
                webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
                reconnectDelay: 5000,
                debug: (str) => {
                    console.log('DEBUG', str);
                },
            });

            stompClient.onConnect = () => {
                stompClient.subscribe(`/ws/sub/room/${roomId}`, (message) => {
                    const newChat = JSON.parse(message.body) as ChatResponse;

                    axiosGet(`/chat/room/${roomId}/chat/${newChat.chatId}`);

                    console.log('room Received: ', message);

                    setNewChats((prev) => [...prev, newChat]);
                });

                stompClient.subscribe(
                    `/ws/sub/user/${email}/queue/errors`,
                    (message) => {
                        console.log('from error');

                        console.log('Received: ', message.body);
                    }
                );
            };

            stompClient.onStompError = (frame) => {
                console.log(`Broker error: ${frame.headers.message}`);
                console.log(`Details: ${frame.body}`);
            };

            stompClient.activate();
            return stompClient;
        };

        const main = async () => {
            if (token && user) {
                const stompClient = connectToWebSocket(token, user.email);
                stompClientRef.current = stompClient;
            }
        };

        main();

        return () => {
            stompClientRef.current?.deactivate();
        };
    }, []);

    return ReactDOM.createPortal(
        <div
            className="fixed z-30 inset-0  bg-black/60   flex items-center justify-center"
            onClick={closeModal}
        >
            <div
                className="w-[40vw] h-[80vh] fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg pt-5 flex flex-col" // 여기에 flex와 flex-col 추가
                onClick={(e) => e.stopPropagation()}
            >

                <div className="w-full flex items-center justify-between px-5 py-2">
                    <div className="flex items-center">
                        <ChatBubbleIcon color="#222222" className="mr-2.5"/>
                        <span className="text-2xl font-bold">{nickname}</span>
                    </div>
                    <div
                        onClick={closeModal}
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out text-gray-600 hover:text-gray-800"
                    >
                        <XIcon color="#222222"/>
                    </div>
                </div>
                <hr className="w-full mt-5 border-[#D9D9D9]"/>

                <ChatList
                    key={`ChatList` + roomId}
                    roomId={roomId}
                    newChats={newChats}
                    reset={() => setNewChats([])}
                />

                <ChatMessageInput
                    userId={userId}
                    roomId={roomId}
                    key={`ChatMessageInput` + roomId}
                    stompClientRef={stompClientRef}
                />
            </div>
        </div>,
        document.body
    );
};

export default ChatModal;

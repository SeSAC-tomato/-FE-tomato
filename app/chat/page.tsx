'use client';

import ChatModal from '@/components/chat/ChatModal';
import Room from '@/components/chat/Room';
import ChatBubbleIcon from '@/components/icons/chat/ChatBubbleIcon';
import {axiosGet} from '@/utils/api/chat/chatApi';
import {
    ChatCommonResponse,
    ChatDefaultPageRequest,
    ChatDefaultPageResponse,
    ChatListPageResponse,
    ChatListSingleResponse,
} from '@/utils/type/chat/chat';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import MainHeader from "@/components/header/MainHeader";

const ChatPage = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState<ChatListSingleResponse[]>();

    const [pageInfo, setPageInfo] = useState<ChatDefaultPageResponse>();

    console.log(rooms);

    const [modalInfo, setModalInfo] = useState<number>();

    // 목록 페이징 안되어있음

    const closeModal = () => {
        setRooms((prev) => {
            if (prev && prev.length > 0) {
                if (modalInfo) {
                    prev.find((room) => room.roomId == modalInfo)!.unreadCount = 0;
                }
            }

            return prev;
        });
        setModalInfo(undefined);
    };

    const openModal = (roomId: number) => {
        setModalInfo(roomId);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await axiosGet<
                ChatCommonResponse<ChatListPageResponse>,
                ChatDefaultPageRequest
            >('/chat', {page: 0, size: 15});

            const {rooms, currentPage, size, totalElements, totalPages} = data.data;

            setRooms(rooms);
            setPageInfo({currentPage, size, totalElements, totalPages});
        };
        fetchData();
    }, []);

    return (
        <>
            <MainHeader/>
            <div className="w-[80%] mx-auto">
                {modalInfo != undefined ? (
                    <ChatModal
                        userId={rooms!.find(room => room.roomId == modalInfo)!.userId}
                        onClose={closeModal}
                        roomId={modalInfo}
                        nickname={
                            rooms!.find((room) => room.roomId == modalInfo)!.userNickname
                        }
                        key={modalInfo}
                    />
                ) : (
                    ''
                )}
                <div className="pt-10 flex items-center">
                    <div className="pr-2.5 pl-5">
                        <ChatBubbleIcon color="#222222"/>
                    </div>
                    <span className="text-2xl font-bold">채팅</span>
                </div>
                <hr className="w-full mt-5 border-[#D9D9D9]"/>
                {rooms && rooms.length == 0 && <div>아직 채팅이 없어요.</div>}
                {rooms?.map((room, index) => (
                    <Room
                        openModal={() => openModal(room.roomId)}
                        key={room.roomId}
                        room={room}
                        isLast={rooms.length == index + 1}
                    />
                ))}

            </div>
        </>
    );
};

export default ChatPage;

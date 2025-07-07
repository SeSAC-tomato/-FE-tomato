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
import {useEffect, useState} from 'react';
import MainHeader from "@/components/header/MainHeader";
import {getChatRoomsUrl} from "@/utils/chatUtils/constants";

const ChatPage = () => {
    const [rooms, setRooms] = useState<ChatListSingleResponse[]>();
    const [pageInfo, setPageInfo] = useState<ChatDefaultPageResponse>();
    const [modalInfo, setModalInfo] = useState<number>();

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

    const fetchData = async (pageNumber: number) => {
        const data = await axiosGet<
            ChatCommonResponse<ChatListPageResponse>,
            ChatDefaultPageRequest
        >(getChatRoomsUrl(), {page: pageNumber, size: 15});

        const {rooms, currentPage, size, totalElements, totalPages} = data.data;

        setRooms(prev => prev ? [...prev, ...rooms] : rooms);
        setPageInfo({currentPage, size, totalElements, totalPages});
    };

    const getMoreRooms = () => {
        if (!pageInfo) return null;

        if (pageInfo?.currentPage + 1 > pageInfo?.totalPages) {
            fetchData(pageInfo?.currentPage + 1)
        }
    }

    useEffect(() => {

        const main = async () => {
            await fetchData(0);
        }
        main();
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
                {pageInfo &&
                    pageInfo.currentPage + 1 > pageInfo.totalPages &&
                    <div className="flex justify-center">
                        <button
                            className='px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 hover:scale-105 transition duration-200 cursor-pointer'>
                            더 많은 채팅 불러오기
                        </button>
                    </div>}

            </div>
        </>
    );
};

export default ChatPage;

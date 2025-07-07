'use client';

import {ChatType, RoomProgressEnum} from '@/utils/type/chat/chatEnums';
import AddImageIcon from '../icons/chat/AddImageIcon';
import CompletedIcon from '../icons/chat/CompletedIcon';
import ScheduleIcon from '../icons/chat/ScheduleIcon';
import {useEffect, useState} from "react";
import {axiosGet} from "@/utils/api/chat/chatApi";
import {
    ChatCommonResponse,
    ChatPostStatus,
    ChatProductCategory,
    ChatRoomInfoResponse,
    ChatUserSellingResponse
} from "@/utils/type/chat/chat";
import ChatSellingInfoModal from "@/components/chat/ChatSellingInfoModal";
import ChatProgressModal from "@/components/chat/ChatProgressModal";
import {getChatRoomInfoFromRoomUrl, getUserSellingListUrl} from "@/utils/chatUtils/constants";

type Props = {
    changeMode: (chatType: ChatType) => void;
    roomId: number;
    userId: number;
    sendMessage: (chatType: ChatType, isDone?: boolean, targetId?: number) => void;
};

const ChatSelectBox = ({changeMode, roomId, userId, sendMessage}: Props) => {
    const [roomProgressInfo, setRoomProgressInfo] = useState<ChatRoomInfoResponse>()
    const [sellingInfo, setSellingInfo] = useState<ChatUserSellingResponse>()

    const [modalInfo, setModalInfo] = useState<{ modal: "book" | "progress" | undefined }>()

    const controlModal = (modal: "book" | "progress" | undefined) => {
        setModalInfo({modal})
    }

    const dummySellingInfo: ChatUserSellingResponse = {
        targetUserId: 2,
        posts: [{
            id: 1,
            title: "아이패드 프로 5세대 판매합니다",
            price: 950000,
            content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
            postStatus: ChatPostStatus.SELLING,
            productCategory: ChatProductCategory.DIGITAL_DEVICE,
            createdAt: "2025-07-05T15:30:00Z",
            updatedAt: "2025-07-05T15:45:00Z",
            userId: 123,
            nickname: "전자기기덕후",
            images: [
                "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
            ]
        }, {
            id: 1,
            title: "아이패드 프로 5세대 판매합니다",
            price: 950000,
            content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
            postStatus: ChatPostStatus.SELLING,
            productCategory: ChatProductCategory.DIGITAL_DEVICE,
            createdAt: "2025-07-05T15:30:00Z",
            updatedAt: "2025-07-05T15:45:00Z",
            userId: 123,
            nickname: "전자기기덕후",
            images: [
                "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
            ]
        }, {
            id: 1,
            title: "아이패드 프로 5세대 판매합니다",
            price: 950000,
            content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
            postStatus: ChatPostStatus.SELLING,
            productCategory: ChatProductCategory.DIGITAL_DEVICE,
            createdAt: "2025-07-05T15:30:00Z",
            updatedAt: "2025-07-05T15:45:00Z",
            userId: 123,
            nickname: "전자기기덕후",
            images: [
                "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
            ]
        }, {
            id: 1,
            title: "아이패드 프로 5세대 판매합니다",
            price: 950000,
            content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
            postStatus: ChatPostStatus.SELLING,
            productCategory: ChatProductCategory.DIGITAL_DEVICE,
            createdAt: "2025-07-05T15:30:00Z",
            updatedAt: "2025-07-05T15:45:00Z",
            userId: 123,
            nickname: "전자기기덕후",
            images: [
                "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
            ]
        }, {
            id: 1,
            title: "아이패드 프로 5세대 판매합니다",
            price: 950000,
            content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
            postStatus: ChatPostStatus.SELLING,
            productCategory: ChatProductCategory.DIGITAL_DEVICE,
            createdAt: "2025-07-05T15:30:00Z",
            updatedAt: "2025-07-05T15:45:00Z",
            userId: 123,
            nickname: "전자기기덕후",
            images: [
                "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
            ]
        }, {
            id: 1,
            title: "아이패드 프로 5세대 판매합니다",
            price: 950000,
            content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
            postStatus: ChatPostStatus.SELLING,
            productCategory: ChatProductCategory.DIGITAL_DEVICE,
            createdAt: "2025-07-05T15:30:00Z",
            updatedAt: "2025-07-05T15:45:00Z",
            userId: 123,
            nickname: "전자기기덕후",
            images: [
                "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
            ]
        },
            {
                id: 1,
                title: "아이패드 프로 5세대 판매합니다",
                price: 950000,
                content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
                postStatus: ChatPostStatus.SELLING,
                productCategory: ChatProductCategory.DIGITAL_DEVICE,
                createdAt: "2025-07-05T15:30:00Z",
                updatedAt: "2025-07-05T15:45:00Z",
                userId: 123,
                nickname: "전자기기덕후",
                images: [
                    "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
                ]
            },
            {
                id: 1,
                title: "아이패드 프로 5세대 판매합니다",
                price: 950000,
                content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
                postStatus: ChatPostStatus.SELLING,
                productCategory: ChatProductCategory.DIGITAL_DEVICE,
                createdAt: "2025-07-05T15:30:00Z",
                updatedAt: "2025-07-05T15:45:00Z",
                userId: 123,
                nickname: "전자기기덕후",
                images: [
                    "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
                ]
            },
            {
                id: 1,
                title: "아이패드 프로 5세대 판매합니다",
                price: 950000,
                content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
                postStatus: ChatPostStatus.SELLING,
                productCategory: ChatProductCategory.DIGITAL_DEVICE,
                createdAt: "2025-07-05T15:30:00Z",
                updatedAt: "2025-07-05T15:45:00Z",
                userId: 123,
                nickname: "전자기기덕후",
                images: [
                    "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
                ]
            }
        ]
    }
    const dummyRoomProgressInfo: ChatRoomInfoResponse = {
        // 채팅방의 고유 ID
        roomId: 1,

        // 구매를 요청한 사용자의 ID
        requestUserId: 2,

        // 현재 거래 진행 상태 ('예약 확정' 단계)
        roomProgress: RoomProgressEnum.END_REQUEST,

        // 거래 대상이 되는 게시물 정보
        targetPost: {
            // 게시물의 고유 ID
            id: 1,

            // 게시물 제목
            title: '거의 새것 같은 LG 스탠바이미 TV',

            // 가격
            price: 650000,

            // 게시물 내용
            content: '2024년 5월에 구매했고, 실사용이 적어 상태가 매우 좋습니다. 모든 구성품과 박스 그대로 보관 중입니다. 직거래 선호합니다.',

            // 게시물 상태 (ChatPostStatus 타입에 따름)
            postStatus: ChatPostStatus.SELLING, // '판매중' 에서 '예약중'으로 변경된 상태

            // 상품 카테고리
            productCategory: ChatProductCategory.DIGITAL_DEVICE,

            // 생성 및 수정 시각 (ISO 8601 형식)
            createdAt: '2025-07-01T14:20:10Z',
            updatedAt: '2025-07-03T11:05:00Z',

            // 판매자의 고유 ID (requestUserId와 다름)
            userId: 2,

            // 판매자의 닉네임
            nickname: '판교너구리',

            // 상품 이미지 URL 배열 (optional)
            images: [
                'https://dimg.donga.com/wps/NEWS/IMAGE/2022/02/23/112010926.1.jpg', // 예시 이미지 1
            ],
        }
    }


    useEffect(() => {
        const fetchSellingList = async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const data = await axiosGet<ChatCommonResponse<ChatUserSellingResponse>>(getUserSellingListUrl(userId))

            console.log(data)
            if (data.data.posts.length > 0) {
                setSellingInfo(data.data);
            }

        }


        const fetchRoomInfo = async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const data = await axiosGet<ChatCommonResponse<ChatRoomInfoResponse>>(getChatRoomInfoFromRoomUrl(roomId))
            if (data.data.roomId) {
                setRoomProgressInfo(data.data);
            }
        }

        const main = async () => {
            await fetchRoomInfo()
            await fetchSellingList()
        }
        main();
    }, []);


    return (<>
            {modalInfo?.modal == "progress" && roomProgressInfo &&
                <ChatProgressModal userId={userId} roomProgressInfo={roomProgressInfo} sendMessage={sendMessage}
                                   closeModal={() => controlModal(undefined)}/>}
            {sellingInfo && modalInfo?.modal == "book" && <ChatSellingInfoModal
                bookClick={(targetId: number) => sendMessage(ChatType.EVENT_BOOK, false, targetId)}
                closeModal={() => controlModal(undefined)}
                sellingInfo={sellingInfo}/>}
            <div className="relative">
                <div className="h-20 flex justify-evenly items-center">
                    <div
                        onClick={() => {
                            document.getElementById('chat-file-upload')?.click();
                            console.log('chatmode to Image');

                            changeMode(ChatType.IMAGE);
                        }}
                        className="w-15 h-15 flex flex-col items-center justify-center rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                    >
                        <AddImageIcon imageColor="#333333"/>
                        <span className="pt-2 text-xs text-center text-gray-700">이미지</span>
                    </div>
                    <>
                        {sellingInfo && !roomProgressInfo && <div
                            onClick={() => {
                                controlModal("book")
                            }}
                            className="w-15 h-15 flex flex-col items-center justify-center rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer">
                            <ScheduleIcon color="#333333"/>
                            <span className="pt-2 text-xs text-center text-gray-700">
              예약하기
            </span>
                        </div>}

                        {roomProgressInfo &&
                            <div
                                onClick={() => controlModal("progress")}
                                className="w-15 h-15 flex flex-col items-center justify-center rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer">
                                <CompletedIcon/>
                                <span className="pt-2 text-xs text-center text-gray-700">
              진행상황
            </span>
                            </div>
                        }
                    </>
                </div>
            </div>
        </>
    );
};

export default ChatSelectBox;

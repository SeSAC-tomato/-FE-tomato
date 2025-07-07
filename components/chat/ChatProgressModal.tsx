'use client';
import ReactDOM from 'react-dom';
import XIcon from "@/components/icons/chat/XIcon";
import {ChatRoomInfoResponse} from "@/utils/type/chat/chat";
import {ChatType, RoomProgressEnum} from "@/utils/type/chat/chatEnums";
import CompletedIcon from "@/components/icons/chat/CompletedIcon";

type Props = {
    closeModal: () => void;
    userId: number;
    roomProgressInfo: ChatRoomInfoResponse
    sendMessage: (chatType: ChatType, isDone?: boolean, targetId?: number) => void;
};

const ChatProgressModal = ({closeModal, userId, roomProgressInfo, sendMessage}: Props) => {

    return ReactDOM.createPortal(
        <div
            className="fixed z-40 inset-0  bg-black/60   flex items-center justify-center"
            onClick={closeModal}
        >
            <div
                className="w-[40vw] h-[80vh] fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg pt-5 flex flex-col" // 여기에 flex와 flex-col 추가
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex items-center justify-between px-5 py-2">
                    <div className="flex items-center">
                        <CompletedIcon className="mr-2.5"/>
                        <span className="text-2xl font-bold">진행 상황</span>
                    </div>
                    <div
                        onClick={closeModal}
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out text-gray-600 hover:text-gray-800"
                    >
                        <XIcon color="#222222"/>
                    </div>
                </div>
                <hr className="w-full mt-5 border-[#D9D9D9]"/>
                <div className="flex-grow flex flex-col overflow-y-auto">
                    <div className="p-5">
                        <div className="flex items-center space-x-4">
                            <div
                                className="h-full w-24 flex-shrink-0 border-0 rounded-md p-2 flex items-center justify-center bg-gray-100">
                                <img
                                    src={roomProgressInfo.targetPost.images?.[0] || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYgQrX3JiyR8wWYWKvTnjgxRgxxtRIw0RJtw&s'}
                                    alt={roomProgressInfo.targetPost.title}
                                    className="w-20 h-20 rounded-lg object-contain border border-gray-200"
                                />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">거래 상품</p>
                                <p className="font-bold text-lg leading-tight">{roomProgressInfo.targetPost.title}</p>
                                <p className="font-semibold text-xl text-blue-600">{roomProgressInfo.targetPost.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    </div>
                    <hr className="w-full border-[#D9D9D9]"/>

                    {/* 2. 진행 단계 (Stepper) */}
                    <div className="p-5 flex-grow">
                        <h3 className="text-lg font-semibold mb-6">거래 진행 상태</h3>

                        {(() => {
                            // 현재 진행 상태에 따라 현재 단계 인덱스를 결정합니다.
                            const progressSteps = ['예약 요청', '예약 확정', '거래 완료'];
                            const progressMap = {
                                [RoomProgressEnum.BOOK_REQUEST]: 0,
                                [RoomProgressEnum.BOOKED]: 1,
                                [RoomProgressEnum.END_REQUEST]: 2,
                            };
                            // @ts-ignore
                            const currentIndex = progressMap[roomProgressInfo.roomProgress] ?? 0;

                            return (
                                <div className="relative">
                                    {/* 세로 연결선 */}
                                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                                    <ul className="space-y-8">
                                        {progressSteps.map((step, index) => {
                                            const isCompleted = index < currentIndex;
                                            const isCurrent = index === currentIndex;

                                            return (
                                                <li key={step} className="flex items-center space-x-4 relative z-10">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                                        ${isCompleted ? 'bg-blue-500' : isCurrent ? 'bg-blue-500 scale-110' : 'bg-gray-300'}`
                                                    }>
                                                        {isCompleted ? '✓' : index + 1}
                                                    </div>
                                                    <span
                                                        className={`font-semibold ${isCurrent ? 'text-blue-600' : 'text-gray-800'}`}>
                                        {step}
                                                        {isCurrent &&
                                                            <span className="text-sm font-normal text-gray-500 ml-2">(현재 단계)</span>}
                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })()}
                    </div>
                    {/* 이 부분 백엔드 처리 추가 해야함 */}
                    <ActionArea
                        // isDone 추가해야함
                        userId={userId}
                        chatRoomInfo={roomProgressInfo}
                        onAccept={() => sendMessage(ChatType.EVENT_BOOK, true, roomProgressInfo.targetPost.id)}
                        onCancelRequest={() => sendMessage(ChatType.EVENT_CANCEL, undefined, roomProgressInfo.targetPost.id)}
                        onEndRequest={() => sendMessage(ChatType.EVENT_END, false, roomProgressInfo.targetPost.id)}
                        onConfirmEnd={() => sendMessage(ChatType.EVENT_END, true, roomProgressInfo.targetPost.id)}
                    />

                </div>
            </div>
        </div>,
        document.body
    );
};

type ActionAreaProps = {
    userId: number;
    chatRoomInfo: ChatRoomInfoResponse;
    onCancelRequest: () => void;
    onAccept: () => void; // 예약 수락
    onEndRequest: () => void; // 종료 요청
    onConfirmEnd: () => void; // 종료 수락
}


const ActionArea = ({
                        userId,
                        chatRoomInfo,
                        onCancelRequest,
                        onAccept, // 예약 수락
                        onEndRequest, // 종료 요청
                        onConfirmEnd,  // 종료 수락
                    }: ActionAreaProps) => {
    const isRequester = userId !== chatRoomInfo.requestUserId;


    console.log("Am I Requester?", isRequester);


    const {roomProgress} = chatRoomInfo;

    const renderActions = () => {
        switch (roomProgress) {
            case 'BOOK_REQUEST':
                if (isRequester) {
                    // 내가 예약 요청을 보낸 경우
                    return (
                        <>
                            <p className="text-center text-gray-600 mb-3">판매자의 수락을 기다리고 있습니다.</p>
                            <button onClick={onCancelRequest}
                                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                요청 취소하기
                            </button>
                        </>
                    );
                } else {
                    // 내가 예약 요청을 받은 경우 (판매자)
                    return (
                        <>
                            <p className="text-center text-gray-600 mb-3">구매자가 예약을 요청했습니다. 수락하시겠습니까?</p>
                            <div className="flex space-x-3">
                                <button onClick={onAccept}
                                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    수락하기
                                </button>
                                <button onClick={onCancelRequest}
                                        className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                    거절하기
                                </button>
                            </div>
                        </>
                    );
                }

            case 'BOOKED':
                // 예약이 확정된 상태. 양쪽 모두 거래 완료를 요청할 수 있음.
                return (
                    <>
                        <p className="text-center text-gray-600 mb-3">예약이 확정되었습니다. 거래는 잘 하셨나요?</p>
                        <div className="flex space-x-3">
                            <button onClick={onEndRequest}
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                거래 완료 요청하기
                            </button>
                            <button onClick={onCancelRequest}
                                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                취소하기
                            </button>
                        </div>
                    </>
                );
            case 'END_REQUEST':

                if (isRequester) {
                    // 내가 거래 완료를 요청한 경우
                    return <>
                        <p className="text-center text-gray-600">상대방의 거래 완료 확정을 기다리고 있습니다.</p>
                        <button onClick={onCancelRequest}
                                className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                            취소하기
                        </button>
                    </>;
                } else {
                    // 내가 거래 완료 요청을 받은 경우
                    return (
                        <>
                            <p className="text-center text-gray-600 mb-3">상대방이 거래 완료를 요청했습니다.</p>
                            <div className="flex space-x-3">
                                <button onClick={onConfirmEnd}
                                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    거래 완료 확정하기
                                </button>
                                <button onClick={onCancelRequest}
                                        className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                    거절하기
                                </button>
                            </div>
                        </>
                    );
                }

            default:
                return null;
        }
    };

    return (
        <div className="mt-auto p-4 bg-white border-t border-gray-200">
            <div className="w-full">
                {renderActions()}
            </div>
        </div>
    );
};


export default ChatProgressModal;

import {ChatUserSellingResponse} from "@/utils/type/chat/chat";
import ChatPostInfo from "@/components/chat/ChatPostInfo";
import ChatBubbleIcon from "@/components/icons/chat/ChatBubbleIcon";
import XIcon from "@/components/icons/chat/XIcon";
import ReactDOM from 'react-dom';

type Props = {
    bookClick: (targetId: number) => void;
    sellingInfo: ChatUserSellingResponse;
    closeModal: () => void;
};


const ChatSellingInfoModal = ({sellingInfo, closeModal, bookClick}: Props) => {

    return ReactDOM.createPortal(<>
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
                        <ChatBubbleIcon color="#222222" className="mr-2.5"/>
                        <span className="text-2xl font-bold">판매중인 상품</span>
                    </div>
                    <div
                        onClick={closeModal}
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out text-gray-600 hover:text-gray-800"
                    >
                        <XIcon color="#222222"/>
                    </div>
                </div>
                <hr className="w-full mt-5 border-[#D9D9D9]"/>
                <div className="overflow-auto">
                    {sellingInfo.posts.map(post => {
                        return <div key={post.id} className="grid grid-cols-20 items-center ">
                            <div className="col-span-14">
                                <ChatPostInfo post={post}/>
                            </div>
                            <button
                                onClick={() => bookClick(post.id)}
                                className={`col-span-5 mx-3 px-2 py-4  bg-red-600 text-white rounded font-semibold hover:bg-red-700 duration-200 cursor-pointer text-base  shadow hover:scale-105 transition-all`}
                            >
                                예약하기
                            </button>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </>, document.body)
}

export default ChatSellingInfoModal
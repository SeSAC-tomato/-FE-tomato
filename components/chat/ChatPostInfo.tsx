"use client"
import {ChatPostResponse} from "@/utils/type/chat/chat";

type Props = {
    post?:ChatPostResponse
};

// post의 사진, 제목, 가격을 채팅 관련 컴포넌트에서 보여주기 위한 컴포넌트

const ChatPostInfo = ({post }: Props) => {

    // const post:ChatPostResponse = {
    //     id: 1,
    //     title: "아이패드 프로 5세대 판매합니다",
    //     price: 950000,
    //     content: "구매 후 거의 사용하지 않아 상태가 매우 좋습니다. 구성품 모두 포함되어 있습니다.",
    //     postStatus: "SELLING",
    //     productCategory: "DIGITAL_DEVICE",
    //     createdAt: "2025-07-05T15:30:00Z",
    //     updatedAt: "2025-07-05T15:45:00Z",
    //     userId: 123,
    //     nickname: "전자기기덕후",
    //     images: [
    //         "https://1801889e95b1f9bf.kinxzone.com/webfile/product/16/16593/94p9uf1lrtuw.jpg",
    //     ]
    // }

    return <div>
        <div>
            <div className="flex p-3 items-center h-30">
                <div className="h-full w-24 flex-shrink-0 border-0 rounded-md p-2 flex items-center justify-center bg-gray-100">
                    <img
                        // src={'http://localhost:8080/api/v1/tes/images/' + post.images![0]}
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYgQrX3JiyR8wWYWKvTnjgxRgxxtRIw0RJtw&s"}
                        alt="alt"

                        className="object-contain h-full w-full"
                    />
                </div>
                <div className="flex flex-col justify-evenly h-full flex-1 min-w-0 pl-4">
                    <div>
                        <p className="truncate">
                            <span className="font-semibold text-[1rem]">{post.title}</span>
                        </p>
                    </div>
                    <div>
              <span className="font-semibold text-[1rem]">
                {post.price.toLocaleString() + '원'}
              </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ChatPostInfo;
import mockPosts from "@/utils/mock/mockPosts";
import PostCard from "../PostCard/PostCard";
import LikeButton from "../button/LikeButton";

interface PostsListProps {
  page: number;
  pageSize?: number;
}

export default function PostsList({ page, pageSize = 8 }: PostsListProps) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = mockPosts.slice(start, end);

  return (
    <div className="py-8 px-2">
      <div className="grid grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white/90 rounded-xl shadow hover:shadow-xl transition p-4 flex flex-col"
          >
            <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {/* 판매완료 뱃지 등 필요시 추가 */}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="font-bold text-lg truncate">{item.title}</div>
              <div className="text-[#e53935] font-extrabold text-xl mt-1">
                {item.price.toLocaleString()}원
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {item.region} · {item.category} · {item.time}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <LikeButton
                isLiked={item.liked}
                handleLike={() => {}}
                fillColor="#e53935"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

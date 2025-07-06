// import mockPosts from "@/utils/mock/mockPosts"
import { PostResponse } from "@/utils/domain/label"
import PostCard from "../PostCard/PostCard"

interface PostsListProps {
  posts: PostResponse[]
  loading: boolean
  error: string | null
}

export default function PostsList({ posts, loading, error }: PostsListProps) {
  // const start = (page - 1) * pageSize;
  // const end = start + pageSize;
  // const items = mockPosts.slice(start, end);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-600 text-lg">
        게시물을 불러오는 중입니다...
      </div>
    )
  }

  if (error) {
    return <div className="py-10 text-center text-red-500 text-lg">{error}</div>
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500 text-lg">
        조건에 맞는 게시물이 없습니다.
      </div>
    )
  }

  return (
    <div className="py-8 px-2">
      <div className="grid grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

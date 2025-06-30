import PostCard from "../PostCard/PostCard"

export default function PostsList() {
  return (
    <>
      <div className="mt-[4.20vh] flex-grow p-4">
        <div className="flex flex-wrap justify-center sm:justify-center md:justify-center lg:justify-between">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
      </div>
    </>
  )
}

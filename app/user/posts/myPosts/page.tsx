"use client";
import { useEffect, useState } from "react";
import { getMyPosts } from "@/utils/api/user/api";

export default function MyPostsPage({
  params,
}: {
  params: { userId: string };
}) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getMyPosts(Number(params.userId)).then((res) => setPosts(res.data));
  }, [params.userId]);

  return (
    <div>
      <h1>내 게시물</h1>
      {posts.map((post, idx) => (
        <div key={idx}>
          <p>{post.title}</p>
        </div>
      ))}
    </div>
  );
}

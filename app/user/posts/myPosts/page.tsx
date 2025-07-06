"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api/axios";

export default function MyPostsPage({
  params,
}: {
  params: { userId: string };
}) {
  const [posts, setPosts] = useState<any[]>([]);

  // useEffect(() => {
  //     axios.get(`/api/v1/user/${params.userId}/posts/myPosts`).then(res => setPosts(res.data))
  // }, [params.userId])

  return (
    <div>
      <h1>내 게시물</h1>
      {/* {posts.map((post, idx) => (
                <div key={idx}>
                    <p>{post.title}</p>
                </div>
            ))} */}
    </div>
  );
}

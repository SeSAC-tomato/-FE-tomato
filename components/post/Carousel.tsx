import {
  BASE_URL,
  ImageDisplayInfo,
  NewImageDisplayInfo,
} from "@/utils/domain/label"
import { CarouselProps } from "@/utils/type/post/type"
import { useEffect, useState } from "react"

export default function Carousel({ postId, post }: CarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

  useEffect(() => {
    if (post?.images && post.images.length > 0) {
      const mainImageIndex = post.images.findIndex(
        (item: NewImageDisplayInfo) => item.mainImage === true
      )
      if (mainImageIndex != -1) {
        setCurrentImageIndex(mainImageIndex)
      } else {
        setCurrentImageIndex(0)
      }
    } else {
      setCurrentImageIndex(0)
    }
  }, [post?.images])

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-start relative">
        <div className="relative w-full max-w-md bg-gray-300 rounded-xl flex items-center justify-center h-full">
          {post?.images && post?.images.length > 0 ? (
            <div className="w-full h-full">
              <img
                src={`${BASE_URL}/api/v1/post/images/${post.images[currentImageIndex].savedName}`}
                alt="제품 이미지"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          ) : (
            <img
              src={`https://picsum.photos/seed/item${postId}/400/400`}
              alt="제품 이미지"
              className="object-cover w-full h-full rounded-xl"
            />
          )}
        </div>
        {post?.images && post.images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) =>
                    (prev - 1 + post.images!.length) % post.images!.length
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out bg-gray-300/30 text-white p-2 rounded-full z-10 hover:bg-opacity-75 focus:outline-none"
            >
              &#9664;
            </button>

            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev + 1) % post.images!.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out bg-gray-300/30  text-white p-2 rounded-full z-10 hover:bg-opacity-75 focus:outline-none"
            >
              &#9654;
            </button>
          </>
        )}
        {post?.images && post.images.length > 1 && (
          <div>
            {post.images!.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  currentImageIndex === index ? "bg-white" : "bg-gray-400"
                } hover:bg-white`}
              ></button>
            ))}
          </div>
        )}{" "}
      </div>
    </>
  )
}

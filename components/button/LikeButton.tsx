"use client";
import { useState } from "react";

import { LikeButtonProps } from "@/utils/type/type";
import HeartIcon from "../icons/HeartIcon";

export default function LikeButton({
  isLiked = false,
  fillColor = "#FEE500",
  handleLike,
}: LikeButtonProps) {
  const likedColor = fillColor; // red-400
  const defaultColor = "#CCCCCC"; // gray-200

  return (
    <>
      <button onClick={handleLike}>
        <HeartIcon color={isLiked ? likedColor : defaultColor} />
      </button>
    </>
  );
}

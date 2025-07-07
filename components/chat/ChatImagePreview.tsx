'use client';

import XIcon from '../icons/chat/XIcon';

type Props = {
  imagePreviews: string;
  undo: () => void;
};

const ChatImagePreview = ({ imagePreviews, undo }: Props) => {
  return (
    <div className="p-2.5">
      <div className="flex-row-reverse flex">
        <div
          onClick={undo}
          className="   p-2 rounded-full cursor-pointer 
    hover:bg-gray-200 
    transition-colors duration-200 ease-in-out
    text-gray-600 hover:text-gray-800"
        >
          <XIcon />
        </div>
      </div>
      <img
        src={imagePreviews}
        alt={`이미지 미리보기`}
        className="w-[90%] object-scale-down mx-auto"
      />
    </div>
  );
};

export default ChatImagePreview;

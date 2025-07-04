import { DropdownProps } from "@/utils/type/type";
import { useState } from "react";

interface DropDownPropsWithClass extends DropdownProps {
  className?: string;
}

export default function DropDown({
  buttonText,
  items,
  onSelect,
  className = "",
}: DropDownPropsWithClass) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block text-left w-48 z-50 ${className}`}>
      <div>
        <button
          type="button"
          onClick={toggleDropDown}
          className="inline-flex justify-center items-center w-full rounded-md px-4 py-2 bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e53935] focus:ring-opacity-50"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {buttonText}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(item)}
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                role="menuitem"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

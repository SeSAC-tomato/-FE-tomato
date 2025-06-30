import { DropdownProps } from "@/utils/type"
import { useState } from "react"

export default function DropDown({
  buttonText,
  items,
  onSelect,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggleDropDown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative inline-block text-left w-48 z-50">
      <div>
        <button
          type="button"
          onClick={toggleDropDown}
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left" // w-full, text-left 추가하여 블록 레벨 버튼처럼 보이게
                role="menuitem"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

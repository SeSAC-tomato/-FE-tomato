import { ButtonProps } from "@/utils/type/post/type"

export default function Button({
  children,
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseClass = `bg-sky-800 w-30 h-10 rounded- mt-1
        text-white 
        hover:bg-sky-900 
        disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
        rounded-[20px]`
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${baseClass} ${className}`}
    >
      {children}
    </button>
  )
}

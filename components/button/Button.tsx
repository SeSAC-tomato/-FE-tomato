import { ButtonProps } from "@/utils/type/type";

export default function Button({
  children,
  backGroundColor = "bg-sky-800",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        w-30 h-10 rounded- mt-1
        ${backGroundColor} text-white 
        hover:bg-sky-900 
        disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
        rounded-[20px]
      `}
    >
      {children}
    </button>
  );
}

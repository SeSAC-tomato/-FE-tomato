"use client";
import React from "react";

interface VerifyResultCardProps {
  icon: React.ReactNode;
  message: string;
  messageClass?: string;
  buttonText?: string;
  buttonColorClass?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
  buttonDisabled?: boolean;
}

export default function VerifyResultCard({
  icon,
  message,
  messageClass = "",
  buttonText,
  buttonColorClass = "bg-gray-400",
  onButtonClick,
  children,
  buttonDisabled = false,
}: VerifyResultCardProps) {
  return (
    <>
      <div className="text-5xl mb-4">{icon}</div>
      <p className={`text-lg font-bold mb-2 ${messageClass}`}>{message}</p>
      {buttonText && onButtonClick && (
        <button
          className={`mt-4 px-6 py-2 ${buttonColorClass} text-white rounded-md font-semibold cursor-pointer disabled:opacity-50`}
          onClick={onButtonClick}
          disabled={buttonDisabled}
        >
          {buttonText}
        </button>
      )}
      {children}
    </>
  );
}

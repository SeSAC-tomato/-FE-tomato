"use client";

interface CheckModalProps {
  open: boolean;
  message: string;
  canUse: boolean;
  onUse: () => void;
  onClose: () => void;
}

export default function RegisterModal({
  open,
  message,
  canUse,
  onUse,
  onClose,
}: CheckModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center min-w-[260px]">
        <p className="mb-4 text-center text-base">{message}</p>
        <div className="flex gap-2">
          {canUse && (
            <button
              className="px-4 py-2 bg-black text-white rounded"
              onClick={onUse}
            >
              사용
            </button>
          )}
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

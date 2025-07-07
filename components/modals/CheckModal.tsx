"use client"

interface CheckModalProps {
  open: boolean
  message: string
  canUse: boolean
  onUse: () => void
  onClose: () => void
}

export default function CheckModal({
  open,
  message,
  canUse,
  onUse,
  onClose,
}: CheckModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center min-w-[400px]">
        <p className="mb-4 text-center text-base">{message}</p>
        <div className="flex gap-2">
          {canUse && (
            <button
              className="px-4 py-2 bg-indigo-700/70 text-white rounded"
              onClick={onUse}
            >
              확인
            </button>
          )}
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

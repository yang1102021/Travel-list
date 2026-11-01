import React from 'react';
import { X } from 'lucide-react';

interface ImageViewerModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  imageUrl,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={imageUrl}
          alt="Item reference"
          className="w-full max-h-[70vh] object-contain bg-slate-900"
        />
        <div className="p-3 text-center text-xs text-slate-500 bg-white">
          點擊任意處或右上角關閉照片
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Smartphone, Share, PlusSquare, Sparkles } from 'lucide-react';
import { GinkgoIcon } from './GinkgoIcon';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appTitle: string;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose, appTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2d251f]/60 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fbf9f5] w-full max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4 animate-in slide-in-from-bottom duration-200 border border-[#e8e2d8]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-3">
          <div className="flex items-center gap-2">
            <GinkgoIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-[#3e352e]">加到手機主畫面 App</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8c7d70] hover:text-[#3e352e] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icon Preview */}
        <div className="flex flex-col items-center justify-center py-2 text-center">
          <div className="relative">
            <img
              src="/src/assets/images/seoul_shopping_quokka_icon_1793536319118.jpg"
              alt="App Icon"
              className="w-20 h-20 rounded-2xl shadow-md border-2 border-[#b08968] ring-4 ring-[#ede8df] object-cover"
            />
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <h4 className="mt-2.5 font-bold text-[#3e352e] text-sm">
            {appTitle || '旅遊購物清單'}
          </h4>
          <p className="text-[11px] text-[#7d7165] font-medium">
            可愛小袋鼠專屬旅行 App 圖示
          </p>
        </div>

        {/* Steps for iOS & Android */}
        <div className="bg-[#f5f0e8]/80 rounded-xl p-3.5 border border-[#ded7cb] space-y-2.5 text-xs text-[#3e352e]">
          <h5 className="font-bold text-[#5c4d43] flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#7f5539]" />
            如何新增到手機桌面（免下載 App 即可使用）：
          </h5>

          <div className="space-y-2 text-[12px] text-[#5c4d43]">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#ede8df] text-[#3e352e] font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <span>
                在手機瀏覽器（如 iPhone <strong>Safari</strong> 或 Android <strong>Chrome</strong>）開啟本網頁。
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#ede8df] text-[#3e352e] font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <span>
                點擊瀏覽器底部的 <strong>分享按鈕 <Share className="w-3 h-3 inline text-blue-600" /></strong>。
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#ede8df] text-[#3e352e] font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <span>
                往下滑選取 <strong>「加入主畫面 <PlusSquare className="w-3 h-3 inline text-[#3e352e]" />」</strong>，完成！
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-bold text-white bg-[#7f5539] hover:bg-[#68432a] rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          我知道了！
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { formatKRW, formatTWD, krwToTWD } from '../utils/currency';
import { GinkgoIcon } from './GinkgoIcon';
import { ArrowRightLeft, Pencil, Check, X } from 'lucide-react';

interface MobileHeaderProps {
  appTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  totalSpentKRW: number;
  totalItemsCount: number;
  purchasedCount: number;
  unpurchasedCount: number;
  exchangeRate: number;
  onOpenExchangeRate: () => void;
  onOpenBuyerBill: () => void;
  onOpenInstallGuide: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  appTitle,
  onUpdateTitle,
  totalSpentKRW,
  totalItemsCount,
  purchasedCount,
  unpurchasedCount,
  exchangeRate,
  onOpenExchangeRate,
  onOpenBuyerBill,
  onOpenInstallGuide,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(appTitle);
  const totalSpentTWD = krwToTWD(totalSpentKRW, exchangeRate);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#e8e2d8] px-3.5 py-3 shadow-2xs">
      {/* Top Title & Exchange Rate Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Avatar + Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Cute Quokka Avatar with Ginkgo Leaf */}
          <div
            className="relative shrink-0 cursor-pointer"
            onClick={onOpenInstallGuide}
            title="點擊查看 App 圖示與安裝教學"
          >
            <img
              src="/src/assets/images/seoul_shopping_quokka_icon_1793536319118.jpg"
              alt="小袋鼠頭像"
              className="w-10 h-10 rounded-2xl object-cover shadow-2xs ring-2 ring-[#e6ccb2] bg-[#f5ebe0]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs border border-[#e8e2d8]">
              <GinkgoIcon className="w-3 h-3 text-amber-500" />
            </span>
          </div>

          {/* Title Area (Editable & never ugly single-character line wraps!) */}
          <div className="min-w-0 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full text-xs font-bold text-[#332b24] bg-white border border-[#c6b8a8] rounded-lg px-2 py-1 focus:outline-hidden"
                  autoFocus
                  placeholder="輸入清單名稱..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 shrink-0 cursor-pointer"
                  title="儲存名稱"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTitleInput(appTitle);
                    setIsEditingTitle(false);
                  }}
                  className="p-1 text-slate-500 hover:bg-slate-100 rounded-md shrink-0 cursor-pointer"
                  title="取消"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group">
                <h1
                  onClick={() => {
                    setTitleInput(appTitle);
                    setIsEditingTitle(true);
                  }}
                  className="text-sm sm:text-base font-bold text-[#332b24] tracking-tight leading-tight truncate cursor-pointer hover:text-[#7f5539] transition-colors"
                  title="點擊自訂旅遊清單標題"
                >
                  {appTitle}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setTitleInput(appTitle);
                    setIsEditingTitle(true);
                  }}
                  className="p-1 text-[#9c8e80] hover:text-[#332b24] rounded-md transition-colors shrink-0 cursor-pointer"
                  title="編輯清單標題"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}

            <p className="text-[11px] text-[#7d7165] font-medium -mt-0.5 whitespace-nowrap truncate">
              共 {totalItemsCount} 件 · 待買 {unpurchasedCount} · 已購 {purchasedCount}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Guaranteed single-line whitespace-nowrap shrink-0) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenExchangeRate}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#4a3f35] bg-[#ede8df] hover:bg-[#e2dbcf] rounded-xl transition-colors cursor-pointer border border-[#ded7cb] whitespace-nowrap shrink-0"
            title="調整外幣匯率"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#7f5539]" />
            <span className="font-mono">{exchangeRate}</span>
          </button>

          {purchasedCount > 0 && (
            <button
              type="button"
              onClick={onOpenBuyerBill}
              className="px-2.5 py-1 text-xs font-bold text-white bg-[#b08968] hover:bg-[#9c7553] rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              title="查看購買人分帳明細"
            >
              分帳明細
            </button>
          )}
        </div>
      </div>

      {/* Actual Spent Summary Bar */}
      <div className="mt-2.5 pt-2 border-t border-[#ede8df] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#5c4f43] font-medium whitespace-nowrap shrink-0">
          <GinkgoIcon className="w-3.5 h-3.5 text-amber-500 inline" />
          <span>已購實付累計：</span>
        </div>
        <div className="text-right flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-sm sm:text-base font-bold text-[#332b24] font-mono tabular-nums">
            {formatKRW(totalSpentKRW)}
          </span>
          <span className="text-xs text-[#7d7165] font-mono tabular-nums">
            (≈ {formatTWD(totalSpentTWD)})
          </span>
        </div>
      </div>
    </header>
  );
};

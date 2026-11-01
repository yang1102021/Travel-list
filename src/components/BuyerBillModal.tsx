import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { formatKRW, formatTWD, krwToTWD } from '../utils/currency';
import { X, Check, Users, Share2 } from 'lucide-react';
import { GinkgoIcon } from './GinkgoIcon';

interface BuyerBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  exchangeRate: number;
}

export const BuyerBillModal: React.FC<BuyerBillModalProps> = ({
  isOpen,
  onClose,
  items,
  exchangeRate,
}) => {
  const [copiedBuyer, setCopiedBuyer] = useState<string | null>(null);

  if (!isOpen) return null;

  // Group by buyer
  const uniqueBuyers = Array.from(new Set(items.map(i => i.buyer || '自己')));

  const buyerGroups = uniqueBuyers.map(buyerName => {
    const buyerItems = items.filter(i => (i.buyer || '自己') === buyerName);
    const purchasedItems = buyerItems.filter(i => i.isPurchased);
    const unpurchasedItems = buyerItems.filter(i => !i.isPurchased);

    const totalKRW = buyerItems.reduce((sum, i) => sum + (i.actualPriceKRW || 0), 0);
    const purchasedKRW = purchasedItems.reduce((sum, i) => sum + (i.actualPriceKRW || 0), 0);

    return {
      name: buyerName,
      items: buyerItems,
      totalCount: buyerItems.length,
      purchasedCount: purchasedItems.length,
      unpurchasedCount: unpurchasedItems.length,
      totalKRW,
      totalTWD: krwToTWD(totalKRW, exchangeRate),
      purchasedKRW,
      purchasedTWD: krwToTWD(purchasedKRW, exchangeRate),
    };
  });

  const handleCopyBill = (buyerName: string) => {
    const group = buyerGroups.find(g => g.name === buyerName);
    if (!group) return;

    let text = `🍂【旅遊代購明細 - ${group.name}】\n`;
    text += `匯率計算: 1 TWD ≈ ${exchangeRate} 外幣\n\n`;

    group.items.forEach((item, idx) => {
      const priceKRW = item.actualPriceKRW || 0;
      const priceTWD = krwToTWD(priceKRW, exchangeRate);
      const statusText = item.isPurchased ? '✅ 已購買' : '⏳ 尚未購買';

      text += `${idx + 1}. ${item.name} x${item.quantity}\n`;
      if (priceKRW > 0) {
        text += `   金額: ${formatKRW(priceKRW)} (約 ${formatTWD(priceTWD)})\n`;
      } else {
        text += `   金額: (尚未填寫結帳金額)\n`;
      }
      text += `   狀態: ${statusText} · 地點: ${item.location}\n`;
      if (item.note) text += `   備註: ${item.note}\n`;
      text += `\n`;
    });

    text += `-------------------------\n`;
    text += `💰 已購買實付總計: ${formatKRW(group.purchasedKRW)} (約 ${formatTWD(group.purchasedTWD)})\n`;
    text += `✨ 由旅遊購物清單整理`;

    navigator.clipboard.writeText(text);
    setCopiedBuyer(buyerName);
    setTimeout(() => setCopiedBuyer(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d251f]/60 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fbf9f5] w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#e8e2d8]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e8e2d8] flex items-center justify-between bg-[#f5f0e8]/80">
          <div className="flex items-center gap-2">
            <GinkgoIcon className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-[#3e352e]">購買人分帳明細</h3>
              <p className="text-[11px] text-[#7d7165]">
                可單獨複製每位親友的帳單，直接貼至 LINE
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8c7d70] hover:text-[#3e352e] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {buyerGroups.map(group => {
            const isCopied = copiedBuyer === group.name;

            return (
              <div
                key={group.name}
                className="p-4 rounded-xl border border-[#ded7cb] bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#3e352e] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b08968] inline-block" />
                      {group.name}
                    </h4>
                    <span className="text-[11px] text-[#7d7165]">
                      共 {group.totalCount} 件 (已購 {group.purchasedCount} · 未購 {group.unpurchasedCount})
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-[#3e352e] font-mono">
                      {formatKRW(group.purchasedKRW)}
                    </div>
                    <div className="text-xs text-[#7d7165] font-mono">
                      ≈ {formatTWD(group.purchasedTWD)}
                    </div>
                  </div>
                </div>

                {/* Mini Item List */}
                <div className="divide-y divide-[#f0ece4] text-xs">
                  {group.items.map(item => (
                    <div key={item.id} className="py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isPurchased ? 'bg-[#7f5539]' : 'bg-[#ded7cb]'
                          }`}
                        />
                        <span
                          className={`truncate ${
                            item.isPurchased ? 'text-[#3e352e]' : 'text-[#8c7d70]'
                          }`}
                        >
                          {item.name} x{item.quantity}
                        </span>
                      </div>
                      <span className="font-mono text-[#5c4d43] shrink-0 ml-2">
                        {item.actualPriceKRW ? formatKRW(item.actualPriceKRW) : '未填金額'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopyBill(group.name)}
                  className={`w-full py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-[#e6ccb2] text-[#3e352e] border-[#b08968]'
                      : 'bg-[#f6f3ed] hover:bg-[#ede8df] text-[#5c4d43] border-[#ded7cb]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3e352e]" />
                      <span>已複製 {group.name} 的明細</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>複製此人明細傳 LINE</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8e2d8] bg-[#f5f0e8]/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#5c4d43] bg-[#ede8df] hover:bg-[#e2dbcf] rounded-lg cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

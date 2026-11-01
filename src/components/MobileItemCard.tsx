import React from 'react';
import { ShoppingItem } from '../types';
import { formatKRW, formatTWD, krwToTWD } from '../utils/currency';
import { getItemLocations } from '../utils/itemHelpers';
import {
  Check,
  MapPin,
  User,
  Minus,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

interface MobileItemCardProps {
  item: ShoppingItem;
  exchangeRate: number;
  onTogglePurchased: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenPriceModal: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onViewImage?: (imageUrl: string) => void;
}

export const MobileItemCard: React.FC<MobileItemCardProps> = ({
  item,
  exchangeRate,
  onTogglePurchased,
  onUpdateQuantity,
  onOpenPriceModal,
  onEdit,
  onDelete,
  onViewImage,
}) => {
  const hasActualPrice = typeof item.actualPriceKRW === 'number' && item.actualPriceKRW > 0;
  const actualTWD = hasActualPrice ? krwToTWD(item.actualPriceKRW!, exchangeRate) : 0;

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all duration-150 ${
        item.isPurchased
          ? 'bg-[#f5f0e8]/50 border-[#ded7cb] opacity-90'
          : 'bg-white border-[#e8e2d8] shadow-2xs hover:border-[#c6b8a8]'
      }`}
    >
      {/* Top Header Row: Checkbox + Name + Top-Right Edit & Delete */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {/* Touch-Friendly Checkbox */}
          <button
            type="button"
            onClick={() => onTogglePurchased(item.id)}
            className={`mt-0.5 w-7 h-7 min-w-[28px] rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
              item.isPurchased
                ? 'bg-[#7f5539] border-[#7f5539] text-white shadow-2xs'
                : 'bg-white border-[#c6b8a8] hover:border-[#7f5539] text-transparent'
            }`}
            title={item.isPurchased ? '標記為未購買' : '標記為已購買'}
            aria-label={item.isPurchased ? '已購' : '標記已購'}
          >
            <Check className={`w-4 h-4 stroke-[3] ${item.isPurchased ? 'opacity-100' : 'opacity-0'}`} />
          </button>

          {/* Item Name + Optional Photo Preview button */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                className={`text-sm font-bold leading-snug transition-colors break-words ${
                  item.isPurchased ? 'text-[#8c7d70] line-through' : 'text-[#2d251f]'
                }`}
              >
                {item.name}
              </h3>

              {item.image && onViewImage && (
                <button
                  type="button"
                  onClick={() => onViewImage(item.image!)}
                  className="p-1 text-[#7f5539] hover:text-[#5c4d43] rounded-lg bg-[#ede8df] cursor-pointer shrink-0 inline-flex items-center gap-0.5 text-[10px] font-medium"
                  title="查看商品照片"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>照片</span>
                </button>
              )}
            </div>

            {/* Clean Metadata Line: Location + Buyer + Notes */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#7d7165]">
              {/* 哪裡買 (Location / Locations) */}
              <div className="inline-flex items-center gap-1 flex-wrap text-[#5c4d43] font-medium">
                <MapPin className="w-3 h-3 text-[#b08968] shrink-0" />
                {getItemLocations(item).length > 0 ? (
                  getItemLocations(item).map(loc => (
                    <span
                      key={loc}
                      className="bg-[#ede8df] text-[#4a3f35] px-1.5 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap"
                    >
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-[#8c7d70] text-[11px]">未指定地點</span>
                )}
              </div>

              <span aria-hidden="true" className="text-[#ded7cb]">·</span>

              {/* 購買人 (Buyer) */}
              <span className="inline-flex items-center gap-1 text-[#3e352e] font-semibold bg-[#ede8df] px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                <User className="w-3 h-3 text-[#7f5539] shrink-0" />
                {item.buyer || '自己'}
              </span>

              {item.note && (
                <>
                  <span aria-hidden="true" className="text-[#ded7cb]">·</span>
                  <span className="text-[#8c7d70] truncate max-w-[140px]">
                    {item.note}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top-Right Quick Actions: Edit & Delete (Compact & Never squeezes the bottom row!) */}
        <div className="flex items-center gap-0.5 shrink-0 -mt-0.5">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8c7d70] hover:text-[#3e352e] hover:bg-[#ede8df] transition-colors cursor-pointer"
            title="編輯商品"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8c7d70]/70 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="刪除商品"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Actual Price Button (Left) & Quantity Stepper (Right) */}
      {/* Zero overlap guarantee with flex-wrap and generous spacing */}
      <div className="mt-3 pt-2.5 border-t border-[#ede8df] flex flex-wrap items-center justify-between gap-2">
        {/* Actual Price Button */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] text-[#8c7d70] font-medium shrink-0">實付:</span>
          <button
            type="button"
            onClick={() => onOpenPriceModal(item)}
            className={`text-xs px-2.5 py-1 rounded-xl font-mono transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
              hasActualPrice
                ? 'bg-[#ede8df] hover:bg-[#e2dbcf] text-[#3e352e] border-[#ded7cb]'
                : 'bg-white text-[#7f5539] border-[#ded7cb] hover:bg-[#ede8df]'
            }`}
            title="點擊輸入/修改實際結帳金額"
          >
            {hasActualPrice ? (
              <>
                <span className="font-bold text-[#3e352e] tabular-nums">
                  {formatKRW(item.actualPriceKRW!)}
                </span>
                <span className="text-[11px] text-[#7d7165] font-normal tabular-nums">
                  (≈ {formatTWD(actualTWD)})
                </span>
              </>
            ) : (
              <span className="font-semibold text-[#7f5539]">+ 輸入結帳金額</span>
            )}
          </button>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center border border-[#ded7cb] rounded-xl bg-[#f6f3ed] overflow-hidden shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="w-7 h-7 flex items-center justify-center text-[#5c4d43] hover:bg-[#ede8df] active:bg-[#e2dbcf] cursor-pointer"
            title="減少數量"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-[#3e352e] font-mono tabular-nums">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-7 h-7 flex items-center justify-center text-[#5c4d43] hover:bg-[#ede8df] active:bg-[#e2dbcf] cursor-pointer"
            title="增加數量"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';
import { formatKRW, formatTWD, krwToTWD } from '../utils/currency';
import { X } from 'lucide-react';
import { GinkgoIcon } from './GinkgoIcon';

interface PriceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingItem | null;
  exchangeRate: number;
  onSavePrice: (itemId: string, priceKRW: number, markAsPurchased: boolean) => void;
}

export const PriceEditModal: React.FC<PriceEditModalProps> = ({
  isOpen,
  onClose,
  item,
  exchangeRate,
  onSavePrice,
}) => {
  const [priceInput, setPriceInput] = useState<string>('');
  const [autoMarkPurchased, setAutoMarkPurchased] = useState<boolean>(true);

  useEffect(() => {
    if (item) {
      setPriceInput(item.actualPriceKRW ? item.actualPriceKRW.toString() : '');
      setAutoMarkPurchased(!item.isPurchased);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const currentPriceNum = parseFloat(priceInput) || 0;
  const convertedTWD = krwToTWD(currentPriceNum, exchangeRate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrice(item.id, currentPriceNum, autoMarkPurchased);
    onClose();
  };

  const addAmount = (amount: number) => {
    const current = parseFloat(priceInput) || 0;
    setPriceInput((current + amount).toString());
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d251f]/60 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fbf9f5] w-full max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#e8e2d8]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e8e2d8] flex items-center justify-between bg-[#f5f0e8]/80">
          <div className="flex items-center gap-2">
            <GinkgoIcon className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-[#3e352e]">輸入實際結帳金額</h3>
              <p className="text-xs text-[#7d7165] truncate max-w-[220px]">
                {item.name}
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

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5c4d43] mb-1">
              實付金額 (外幣金額)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                autoFocus
                value={priceInput}
                onChange={e => setPriceInput(e.target.value)}
                placeholder="例如：32000"
                className="w-full px-4 py-3 text-xl font-bold font-mono text-[#3e352e] bg-white border border-[#ded7cb] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#b08968]"
              />
              <span className="absolute right-3.5 top-3.5 font-bold font-mono text-xs text-[#8c7d70]">
                外幣
              </span>
            </div>
          </div>

          {/* Instant Dual Currency Preview */}
          <div className="p-3.5 bg-[#4a3f35] text-white rounded-xl flex items-center justify-between font-mono">
            <span className="text-xs text-[#ded7cb]">自動換算台幣 (NT$)</span>
            <span className="text-base font-bold text-[#f5ebe0] tabular-nums">
              ≈ {formatTWD(convertedTWD)}
            </span>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => addAmount(5000)}
              className="flex-1 py-1.5 rounded-lg bg-[#ede8df] hover:bg-[#e2dbcf] text-[#4a3f35] font-medium cursor-pointer"
            >
              +5千
            </button>
            <button
              type="button"
              onClick={() => addAmount(10000)}
              className="flex-1 py-1.5 rounded-lg bg-[#ede8df] hover:bg-[#e2dbcf] text-[#4a3f35] font-medium cursor-pointer"
            >
              +1萬
            </button>
            <button
              type="button"
              onClick={() => addAmount(50000)}
              className="flex-1 py-1.5 rounded-lg bg-[#ede8df] hover:bg-[#e2dbcf] text-[#4a3f35] font-medium cursor-pointer"
            >
              +5萬
            </button>
            <button
              type="button"
              onClick={() => setPriceInput('')}
              className="px-2.5 py-1.5 rounded-lg bg-[#ede8df] hover:bg-[#e2dbcf] text-[#7d7165] cursor-pointer"
            >
              清除
            </button>
          </div>

          {/* Toggle mark as purchased */}
          {!item.isPurchased && (
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoMarkPurchased}
                onChange={e => setAutoMarkPurchased(e.target.checked)}
                className="w-4 h-4 rounded border-[#ded7cb] text-[#b08968] focus:ring-[#b08968] cursor-pointer"
              />
              <span className="text-xs text-[#5c4d43] font-medium">
                填寫金額後同時標記為「已購買」
              </span>
            </label>
          )}

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#7d7165] hover:bg-[#ede8df] rounded-xl cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-[#7f5539] hover:bg-[#68432a] rounded-xl cursor-pointer shadow-xs"
            >
              儲存結帳金額
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GinkgoIcon } from './GinkgoIcon';

interface ExchangeRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
  onSaveRate: (rate: number) => void;
}

export const ExchangeRateModal: React.FC<ExchangeRateModalProps> = ({
  isOpen,
  onClose,
  currentRate,
  onSaveRate,
}) => {
  const [rateInput, setRateInput] = useState(currentRate.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(rateInput);
    if (!isNaN(val) && val > 0) {
      onSaveRate(val);
      onClose();
    }
  };

  const setPreset = (preset: number) => {
    setRateInput(preset.toString());
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d251f]/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-[#fbf9f5] w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4 border border-[#e8e2d8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GinkgoIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-[#3e352e]">調整換匯匯率</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8c7d70] hover:text-[#3e352e] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#5c4d43] mb-1">
              1 台幣 (TWD) 等於多少外幣
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                autoFocus
                value={rateInput}
                onChange={e => setRateInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-lg font-bold font-mono text-[#3e352e] bg-white border border-[#ded7cb] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#b08968]"
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-[#8c7d70] font-mono">
                外幣
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#8c7d70]">常見參考牌告：</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[4.5, 41.5, 42.0, 43.0].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setPreset(r)}
                  className={`py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    parseFloat(rateInput) === r
                      ? 'bg-[#7f5539] text-white shadow-2xs'
                      : 'bg-[#ede8df] hover:bg-[#e2dbcf] text-[#5c4d43]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-[#7d7165] rounded-lg cursor-pointer hover:bg-[#ede8df]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#7f5539] hover:bg-[#68432a] rounded-lg cursor-pointer shadow-2xs"
            >
              確認更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

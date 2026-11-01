import React, { useState, useRef, useEffect } from 'react';
import { MapPin, User, X, ChevronDown, Check } from 'lucide-react';

interface FilterBarProps {
  locations: string[];
  buyers: string[];
  selectedLocations: string[];
  selectedBuyer: string;
  onToggleLocation: (loc: string) => void;
  onClearLocations: () => void;
  onSelectBuyer: (buyer: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  locations,
  buyers,
  selectedLocations,
  selectedBuyer,
  onToggleLocation,
  onClearLocations,
  onSelectBuyer,
  onResetFilters,
}) => {
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  const isFiltering = selectedLocations.length > 0 || selectedBuyer !== 'all';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    };
    if (isLocationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationMenuOpen]);

  const locationButtonLabel = () => {
    if (selectedLocations.length === 0) return '全部地點';
    if (selectedLocations.length === 1) return selectedLocations[0];
    return `地點 (${selectedLocations.length})`;
  };

  return (
    <div className="px-3.5 py-2 bg-[#f6f3ed] border-b border-[#e8e2d8] relative z-20">
      <div className="flex items-center gap-2">
        {/* Multi-Select Location Trigger & Dropdown */}
        <div className="flex-1 relative" ref={locationMenuRef}>
          <button
            type="button"
            onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
            className={`w-full flex items-center justify-between bg-white border rounded-xl px-2.5 py-1.5 shadow-2xs text-xs font-medium transition-colors cursor-pointer ${
              selectedLocations.length > 0
                ? 'border-[#b08968] bg-[#faf6f0] text-[#7f5539]'
                : 'border-[#ded7cb] text-[#3e352e]'
            }`}
            title="點擊開啟地點複選選單"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#b08968] shrink-0" />
              <span className="truncate font-semibold">{locationButtonLabel()}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c7d70] shrink-0" />
          </button>

          {/* Multi-Select Location Popover Menu */}
          {isLocationMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-60 max-w-[90vw] bg-[#fbf9f5] border border-[#ded7cb] rounded-2xl shadow-xl p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#ede8df] px-1">
                <span className="text-[11px] font-bold text-[#5c4d43]">地點篩選（可複選）</span>
                {selectedLocations.length > 0 ? (
                  <button
                    type="button"
                    onClick={onClearLocations}
                    className="text-[11px] text-[#7f5539] font-medium hover:underline cursor-pointer"
                  >
                    全部 (清除)
                  </button>
                ) : (
                  <span className="text-[10px] text-[#8c7d70]">顯示全部</span>
                )}
              </div>

              {/* Location items */}
              <div className="max-h-48 overflow-y-auto space-y-1 py-0.5">
                {locations.map(loc => {
                  const isSelected = selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => onToggleLocation(loc)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#7f5539] text-white font-semibold'
                          : 'text-[#3e352e] hover:bg-[#ede8df]'
                      }`}
                    >
                      <span className="truncate">{loc}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {selectedLocations.length > 0 && (
                <div className="pt-1.5 border-t border-[#ede8df] text-center">
                  <button
                    type="button"
                    onClick={() => setIsLocationMenuOpen(false)}
                    className="w-full py-1 text-xs font-bold text-white bg-[#b08968] hover:bg-[#9c7553] rounded-lg transition-colors cursor-pointer"
                  >
                    確定篩選 ({selectedLocations.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buyer Dropdown */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-white border border-[#ded7cb] rounded-xl px-2.5 py-1.5 shadow-2xs">
            <User className="w-3.5 h-3.5 text-[#b08968] shrink-0 mr-1.5" />
            <select
              value={selectedBuyer}
              onChange={e => onSelectBuyer(e.target.value)}
              className="w-full text-xs font-medium text-[#3e352e] bg-transparent focus:outline-hidden cursor-pointer truncate"
            >
              <option value="all">全部購買人</option>
              {buyers.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filter Button */}
        {isFiltering && (
          <button
            type="button"
            onClick={onResetFilters}
            className="p-1.5 rounded-xl bg-[#ede8df] hover:bg-[#e2dbcf] text-[#5c4d43] transition-colors cursor-pointer shrink-0"
            title="重設所有篩選"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

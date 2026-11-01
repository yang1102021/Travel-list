import React from 'react';
import { MapPin, User, X } from 'lucide-react';

interface FilterBarProps {
  locations: string[];
  buyers: string[];
  selectedLocation: string;
  selectedBuyer: string;
  onSelectLocation: (loc: string) => void;
  onSelectBuyer: (buyer: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  locations,
  buyers,
  selectedLocation,
  selectedBuyer,
  onSelectLocation,
  onSelectBuyer,
  onResetFilters,
}) => {
  const isFiltering = selectedLocation !== 'all' || selectedBuyer !== 'all';

  return (
    <div className="px-3.5 py-2 bg-[#f6f3ed] border-b border-[#e8e2d8]">
      <div className="flex items-center gap-2">
        {/* Location Dropdown */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-white border border-[#ded7cb] rounded-xl px-2.5 py-1.5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#b08968] shrink-0 mr-1.5" />
            <select
              value={selectedLocation}
              onChange={e => onSelectLocation(e.target.value)}
              className="w-full text-xs font-medium text-[#3e352e] bg-transparent focus:outline-hidden cursor-pointer truncate"
            >
              <option value="all">全部地點</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
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
            title="重設篩選"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

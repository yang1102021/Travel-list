import React from 'react';
import { ItemFilterStatus } from '../types';

interface StatusFilterTabsProps {
  currentStatus: ItemFilterStatus;
  onChangeStatus: (status: ItemFilterStatus) => void;
  allCount: number;
  unpurchasedCount: number;
  purchasedCount: number;
}

export const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({
  currentStatus,
  onChangeStatus,
  allCount,
  unpurchasedCount,
  purchasedCount,
}) => {
  return (
    <div className="px-3.5 py-2 bg-[#fbf9f5] border-b border-[#e8e2d8]">
      <div className="flex p-1 bg-[#ede8df] rounded-xl">
        <button
          type="button"
          onClick={() => onChangeStatus('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentStatus === 'all'
              ? 'bg-white text-[#3e352e] font-bold shadow-2xs'
              : 'text-[#7d7165] hover:text-[#3e352e]'
          }`}
        >
          <span>全部</span>
          <span className="text-[11px] opacity-75 tabular-nums">({allCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStatus('unpurchased')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentStatus === 'unpurchased'
              ? 'bg-white text-[#3e352e] font-bold shadow-2xs'
              : 'text-[#7d7165] hover:text-[#3e352e]'
          }`}
        >
          <span>未購買</span>
          <span className="text-[11px] opacity-75 tabular-nums">({unpurchasedCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStatus('purchased')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentStatus === 'purchased'
              ? 'bg-white text-[#7f5539] font-bold shadow-2xs'
              : 'text-[#7d7165] hover:text-[#3e352e]'
          }`}
        >
          <span>已購買</span>
          <span className="text-[11px] opacity-75 tabular-nums">({purchasedCount})</span>
        </button>
      </div>
    </div>
  );
};

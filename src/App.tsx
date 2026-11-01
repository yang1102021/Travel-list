import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingItem, ItemFilterStatus, AppSettings } from './types';
import {
  loadStoredItems,
  saveStoredItems,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredLocations,
  saveStoredLocations,
  loadStoredBuyers,
  saveStoredBuyers,
} from './utils/storage';

// Components
import { MobileHeader } from './components/MobileHeader';
import { StatusFilterTabs } from './components/StatusFilterTabs';
import { FilterBar } from './components/FilterBar';
import { MobileItemCard } from './components/MobileItemCard';
import { AddItemModal } from './components/AddItemModal';
import { PriceEditModal } from './components/PriceEditModal';
import { BuyerBillModal } from './components/BuyerBillModal';
import { ExchangeRateModal } from './components/ExchangeRateModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { InstallAppModal } from './components/InstallAppModal';
import { GinkgoIcon } from './components/GinkgoIcon';

// Icons
import { Plus, RotateCcw, Trash2 } from 'lucide-react';

export default function App() {
  // State
  const [items, setItems] = useState<ShoppingItem[]>(loadStoredItems);
  const [settings, setSettings] = useState<AppSettings>(loadStoredSettings);
  const [locations, setLocations] = useState<string[]>(loadStoredLocations);
  const [buyers, setBuyers] = useState<string[]>(loadStoredBuyers);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ItemFilterStatus>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedBuyer, setSelectedBuyer] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [pricingItem, setPricingItem] = useState<ShoppingItem | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredLocations(locations);
  }, [locations]);

  useEffect(() => {
    saveStoredBuyers(buyers);
  }, [buyers]);

  // Handlers
  const handleSaveItem = (
    itemData: Omit<ShoppingItem, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setItems(prev =>
        prev.map(item => (item.id === editingId ? { ...item, ...itemData } : item))
      );
    } else {
      const newItem: ShoppingItem = {
        ...itemData,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setItems(prev => [newItem, ...prev]);
    }
  };

  const handleTogglePurchased = (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;

    const nextPurchasedState = !target.isPurchased;

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isPurchased: nextPurchasedState } : item
      )
    );

    // If marking as purchased and no actual price is set yet, offer to enter actual price
    if (nextPurchasedState && (!target.actualPriceKRW || target.actualPriceKRW <= 0)) {
      setPricingItem({ ...target, isPurchased: true });
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSavePrice = (
    itemId: string,
    priceKRW: number,
    markAsPurchased: boolean
  ) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            actualPriceKRW: priceKRW > 0 ? priceKRW : undefined,
            isPurchased: markAsPurchased ? true : item.isPurchased,
          };
        }
        return item;
      })
    );
  };

  const handleAddCustomLocation = (newLoc: string) => {
    if (!locations.includes(newLoc)) {
      setLocations(prev => [newLoc, ...prev]);
    }
    setSelectedLocation(newLoc);
  };

  const handleAddCustomBuyer = (newBuyer: string) => {
    if (!buyers.includes(newBuyer)) {
      setBuyers(prev => [...prev, newBuyer]);
    }
    setSelectedBuyer(newBuyer);
  };

  const handleClearPurchased = () => {
    if (window.confirm('確定要清除所有已購買的商品嗎？')) {
      setItems(prev => prev.filter(i => !i.isPurchased));
    }
  };

  // Aggregated Counts & Amounts
  const totalItemsCount = items.length;
  const purchasedCount = items.filter(i => i.isPurchased).length;
  const unpurchasedCount = totalItemsCount - purchasedCount;

  // Actual spent sum of purchased items
  const totalSpentKRW = items
    .filter(i => i.isPurchased)
    .reduce((sum, i) => sum + (i.actualPriceKRW || 0), 0);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Status filter
      if (statusFilter === 'purchased' && !item.isPurchased) return false;
      if (statusFilter === 'unpurchased' && item.isPurchased) return false;

      // Location filter
      if (selectedLocation !== 'all' && item.location !== selectedLocation) {
        return false;
      }

      // Buyer filter
      if (selectedBuyer !== 'all' && (item.buyer || '自己') !== selectedBuyer) {
        return false;
      }

      return true;
    });
  }, [items, statusFilter, selectedLocation, selectedBuyer]);

  // Unique lists for dropdowns
  const availableLocations = Array.from(
    new Set([...locations, ...items.map(i => i.location).filter(Boolean)])
  );
  const availableBuyers = Array.from(
    new Set([...buyers, ...items.map(i => i.buyer).filter(Boolean)])
  );

  return (
    <div className="min-h-screen bg-[#ede8df] flex justify-center text-[#3e352e] antialiased sm:py-6">
      {/* Mobile App Container (Gentle earth tone palette, centered on desktop) */}
      <div className="w-full max-w-md bg-[#faf8f5] min-h-screen sm:min-h-[840px] sm:max-h-[920px] sm:rounded-3xl border-x sm:border border-[#ded7cb] shadow-xl flex flex-col relative overflow-hidden">
        {/* 1. Mobile Header with editable title, Ginkgo theme & Quokka mascot */}
        <MobileHeader
          appTitle={settings.appTitle || '首爾銀杏購物清單'}
          onUpdateTitle={newTitle => setSettings({ ...settings, appTitle: newTitle })}
          totalSpentKRW={totalSpentKRW}
          totalItemsCount={totalItemsCount}
          purchasedCount={purchasedCount}
          unpurchasedCount={unpurchasedCount}
          exchangeRate={settings.exchangeRate}
          onOpenExchangeRate={() => setIsRateModalOpen(true)}
          onOpenBuyerBill={() => setIsBillModalOpen(true)}
          onOpenInstallGuide={() => setIsInstallModalOpen(true)}
        />

        {/* 2. Status Segmented Tabs: 全部 · 未購買 · 已購買 */}
        <StatusFilterTabs
          currentStatus={statusFilter}
          onChangeStatus={setStatusFilter}
          allCount={totalItemsCount}
          unpurchasedCount={unpurchasedCount}
          purchasedCount={purchasedCount}
        />

        {/* 3. Filter Bar: 哪裡買 / 購買人 */}
        <FilterBar
          locations={availableLocations}
          buyers={availableBuyers}
          selectedLocation={selectedLocation}
          selectedBuyer={selectedBuyer}
          onSelectLocation={setSelectedLocation}
          onSelectBuyer={setSelectedBuyer}
          onResetFilters={() => {
            setSelectedLocation('all');
            setSelectedBuyer('all');
          }}
        />

        {/* 4. Main Scrollable Shopping List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-24">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <MobileItemCard
                key={item.id}
                item={item}
                exchangeRate={settings.exchangeRate}
                onTogglePurchased={handleTogglePurchased}
                onUpdateQuantity={handleUpdateQuantity}
                onOpenPriceModal={item => setPricingItem(item)}
                onEdit={item => {
                  setEditingItem(item);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDeleteItem}
                onViewImage={url => setViewingImage(url)}
              />
            ))
          ) : (
            /* Clean Empty State with illustrated Quokka */
            <div className="py-14 px-4 text-center">
              <div className="relative inline-block mb-3">
                <img
                  src="/src/assets/images/seoul_shopping_quokka_icon_1793536319118.jpg"
                  alt="首爾購物矮袋鼠"
                  className="w-24 h-24 rounded-3xl mx-auto shadow-md border-2 border-[#b08968] ring-4 ring-[#ede8df] object-cover"
                />
                <span className="absolute -bottom-2 -right-1 bg-white p-1 rounded-full shadow-xs border border-[#ded7cb]">
                  <GinkgoIcon className="w-4 h-4 text-amber-500" />
                </span>
              </div>

              <h3 className="text-base font-bold text-[#3e352e] mb-1">
                {totalItemsCount === 0
                  ? '小袋鼠的購物袋還是空的呢！'
                  : '沒有符合篩選條件的商品'}
              </h3>
              <p className="text-xs text-[#7d7165] max-w-xs mx-auto mb-5 leading-relaxed">
                {totalItemsCount === 0
                  ? '點擊右下角的 ＋ 圓圈按鈕，開始記錄你的旅遊戰利品清單吧！'
                  : '可以點擊上方重設篩選條件，檢視其他商品。'}
              </p>

              {totalItemsCount === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#7f5539] hover:bg-[#68432a] rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增第一筆商品</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation('all');
                    setSelectedBuyer('all');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center gap-1 text-xs text-[#7f5539] font-semibold hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重設所有篩選</span>
                </button>
              )}
            </div>
          )}

          {/* Quick Clear Purchased button if any */}
          {purchasedCount > 0 && statusFilter === 'purchased' && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleClearPurchased}
                className="text-xs text-[#8c7d70] hover:text-rose-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> 清除所有已購商品
              </button>
            </div>
          )}
        </div>

        {/* 5. Fixed Floating Action Button (FAB) in the Bottom Right - Warm Earth Tone + Golden Ginkgo Accent */}
        <div className="fixed bottom-6 right-6 sm:absolute sm:bottom-6 sm:right-6 z-40">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7f5539] via-[#9c6644] to-[#b08968] text-white shadow-xl shadow-[#7f5539]/30 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-white/90 group"
            title="新增商品"
            aria-label="新增商品"
          >
            <Plus className="w-7 h-7 stroke-[2.8] transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>

        {/* Modals */}
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          editingItem={editingItem}
          locations={availableLocations}
          buyers={availableBuyers}
          onAddCustomLocation={handleAddCustomLocation}
          onAddCustomBuyer={handleAddCustomBuyer}
          exchangeRate={settings.exchangeRate}
        />

        <PriceEditModal
          isOpen={!!pricingItem}
          onClose={() => setPricingItem(null)}
          item={pricingItem}
          exchangeRate={settings.exchangeRate}
          onSavePrice={handleSavePrice}
        />

        <BuyerBillModal
          isOpen={isBillModalOpen}
          onClose={() => setIsBillModalOpen(false)}
          items={items}
          exchangeRate={settings.exchangeRate}
        />

        <ExchangeRateModal
          isOpen={isRateModalOpen}
          onClose={() => setIsRateModalOpen(false)}
          currentRate={settings.exchangeRate}
          onSaveRate={rate => setSettings({ ...settings, exchangeRate: rate })}
        />

        <ImageViewerModal
          imageUrl={viewingImage}
          onClose={() => setViewingImage(null)}
        />

        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          appTitle={settings.appTitle || '旅遊購物清單'}
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';
import { krwToTWD, formatTWD } from '../utils/currency';
import { compressImage } from '../utils/imageCompressor';
import { X, Plus, Minus, Camera, MapPin, User, Loader2 } from 'lucide-react';
import { GinkgoIcon } from './GinkgoIcon';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>, editingId?: string) => void;
  editingItem?: ShoppingItem | null;
  locations: string[];
  buyers: string[];
  onAddCustomLocation: (loc: string) => void;
  onAddCustomBuyer: (buyer: string) => void;
  exchangeRate: number;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  locations,
  buyers,
  onAddCustomLocation,
  onAddCustomBuyer,
  exchangeRate,
}) => {
  // 4 Required core fields
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [buyer, setBuyer] = useState('自己');

  // Optional fields
  const [actualPriceKRW, setActualPriceKRW] = useState<string>('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Custom inputs
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [isCustomBuyer, setIsCustomBuyer] = useState(false);
  const [customBuyerInput, setCustomBuyerInput] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setQuantity(editingItem.quantity || 1);
      setLocation(editingItem.location || '');
      setBuyer(editingItem.buyer || '自己');
      setActualPriceKRW(editingItem.actualPriceKRW ? editingItem.actualPriceKRW.toString() : '');
      setNote(editingItem.note || '');
      setImage(editingItem.image || '');
      setIsCustomLocation(false);
      setIsCustomBuyer(false);
      setIsProcessingImage(false);
    } else {
      // Clean defaults for new item
      setName('');
      setQuantity(1);
      setLocation(locations[0] || 'Olive Young');
      setBuyer(buyers[0] || '自己');
      setActualPriceKRW('');
      setNote('');
      setImage('');
      setIsCustomLocation(false);
      setIsCustomBuyer(false);
      setIsProcessingImage(false);
    }
  }, [editingItem, isOpen, locations, buyers]);

  if (!isOpen) return null;

  // Supports iPhone HEIC / HEIF and auto-compresses to lightweight JPEG for buttery smooth speed
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    const isHeic =
      fileNameLower.endsWith('.heic') ||
      fileNameLower.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    setIsProcessingImage(true);
    try {
      let rawBlob: Blob = file;

      if (isHeic) {
        const heic2anyModule = await import('heic2any');
        const heic2any = heic2anyModule.default || heic2anyModule;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.85,
        });
        rawBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      // Automatically compress down to max 1000px JPEG to prevent app lag and localStorage overflow!
      const compressedDataUrl = await compressImage(rawBlob, 1000, 0.8);
      setImage(compressedDataUrl);
    } catch (err) {
      console.warn('Image processing warning, fallback to direct reader:', err);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalLocation = isCustomLocation ? customLocationInput.trim() : location;
    const finalBuyer = isCustomBuyer ? customBuyerInput.trim() : buyer;

    if (isCustomLocation && customLocationInput.trim()) {
      onAddCustomLocation(customLocationInput.trim());
    }
    if (isCustomBuyer && customBuyerInput.trim()) {
      onAddCustomBuyer(customBuyerInput.trim());
    }

    const priceNum = parseFloat(actualPriceKRW);

    onSave(
      {
        name: name.trim(),
        quantity: Math.max(1, quantity),
        location: finalLocation || '未指定',
        buyer: finalBuyer || '自己',
        isPurchased: editingItem ? editingItem.isPurchased : false,
        actualPriceKRW: !isNaN(priceNum) && priceNum > 0 ? priceNum : undefined,
        note: note.trim() || undefined,
        image: image || undefined,
      },
      editingItem ? editingItem.id : undefined
    );

    onClose();
  };

  const priceNum = parseFloat(actualPriceKRW) || 0;
  const approxTWD = krwToTWD(priceNum, exchangeRate);

  return (
    <div className="fixed inset-0 z-50 bg-[#2d251f]/60 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fbf9f5] w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#e8e2d8]">
        {/* Header with gentle earth tone & Ginkgo leaf */}
        <div className="px-5 py-4 border-b border-[#e8e2d8] flex items-center justify-between bg-[#f5f0e8]/80">
          <div className="flex items-center gap-2">
            <GinkgoIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-[#3e352e]">
              {editingItem ? '編輯購物商品' : '新增購物商品'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8c7d70] hover:text-[#3e352e] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* 1. 商品品項 */}
          <div>
            <label className="block text-xs font-bold text-[#3e352e] mb-1.5">
              1. 商品品項 <span className="text-[#b08968]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例：Torriden 精華、Matin Kim 短夾、伴手禮零食"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#ded7cb] rounded-xl text-[#3e352e] focus:outline-hidden focus:ring-2 focus:ring-[#b08968]"
            />
          </div>

          {/* 2. 數量 */}
          <div>
            <label className="block text-xs font-bold text-[#3e352e] mb-1.5">
              2. 數量
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#ded7cb] rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#5c4d43] hover:bg-[#f3efe6] active:bg-[#e8e2d8] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-base font-bold text-[#3e352e] font-mono tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#5c4d43] hover:bg-[#f3efe6] active:bg-[#e8e2d8] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[#8c7d70] text-xs">件 / 個</span>
            </div>
          </div>

          {/* 3. 哪裡買 (Location) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#3e352e] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#b08968]" />
                3. 哪裡買 (購買地點)
              </label>
              <button
                type="button"
                onClick={() => setIsCustomLocation(!isCustomLocation)}
                className="text-[11px] text-[#7f5539] font-semibold hover:underline cursor-pointer"
              >
                {isCustomLocation ? '選擇常見地點' : '+ 自訂地點'}
              </button>
            </div>

            {isCustomLocation ? (
              <input
                type="text"
                value={customLocationInput}
                onChange={e => setCustomLocationInput(e.target.value)}
                placeholder="輸入購買地點，如：漢南洞 Mardi、東大門 DDP..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#b08968] rounded-xl text-[#3e352e] focus:outline-hidden"
              />
            ) : (
              <div className="space-y-2">
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#ded7cb] rounded-xl text-[#3e352e] cursor-pointer"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                {/* Quick touch chips */}
                <div className="flex flex-wrap gap-1.5">
                  {locations.slice(0, 6).map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        location === loc
                          ? 'bg-[#7f5539] text-white shadow-2xs'
                          : 'bg-[#ede8df] text-[#5c4d43] hover:bg-[#e2dbcf]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. 購買人 (Buyer) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#3e352e] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#b08968]" />
                4. 購買人
              </label>
              <button
                type="button"
                onClick={() => setIsCustomBuyer(!isCustomBuyer)}
                className="text-[11px] text-[#7f5539] font-semibold hover:underline cursor-pointer"
              >
                {isCustomBuyer ? '選擇既有購買人' : '+ 新增購買人'}
              </button>
            </div>

            {isCustomBuyer ? (
              <input
                type="text"
                value={customBuyerInput}
                onChange={e => setCustomBuyerInput(e.target.value)}
                placeholder="輸入購買人，如：阿姨、大衛、辦公室主管..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#b08968] rounded-xl text-[#3e352e] focus:outline-hidden"
              />
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {buyers.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBuyer(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        buyer === b
                          ? 'bg-[#b08968] text-white shadow-2xs'
                          : 'bg-[#ede8df] text-[#5c4d43] hover:bg-[#e2dbcf]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Optional: 參考照片 (支援 iPhone HEIC/HEIF 並自動輕量壓縮，保證極速不當機) */}
          <div className="pt-2 border-t border-[#e8e2d8]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#5c4d43]">
                商品參考照片 (支援 iPhone HEIC / JPG / PNG 自動輕量化)
              </label>
              {isProcessingImage && (
                <span className="text-[11px] text-[#b08968] flex items-center gap-1 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" /> 照片轉檔優化中...
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 px-3 py-2 bg-[#ede8df] hover:bg-[#e2dbcf] text-[#4a3f35] rounded-xl cursor-pointer text-xs font-medium transition-colors border border-[#ded7cb]">
                <Camera className="w-4 h-4 text-[#7f5539]" />
                <span>拍照 / 選取照片 (含 HEIC)</span>
                <input
                  type="file"
                  accept="image/*,.heic,.heif,.HEIC,.HEIF"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {image && (
                <div className="flex items-center gap-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-lg border-2 border-[#b08968] shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                  >
                    移除照片
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#8c7d70] mt-1">
              ✨ 系統會自動將相片智慧壓縮至最佳瀏覽畫質，不佔手機容量、滑動不卡頓。
            </p>
          </div>

          {/* Optional: 結帳金額 (可先輸入或買完再填) */}
          <div className="pt-2 border-t border-[#e8e2d8]">
            <label className="block text-xs font-semibold text-[#5c4d43] mb-1">
              結帳金額 (外幣金額，選填，亦可購買後再輸入)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="100"
                value={actualPriceKRW}
                onChange={e => setActualPriceKRW(e.target.value)}
                placeholder="例如：25000"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#ded7cb] rounded-xl font-mono text-[#3e352e] focus:outline-hidden"
              />
              <span className="absolute right-3 top-2 text-[#8c7d70] font-mono text-xs">
                外幣
              </span>
            </div>
            {priceNum > 0 && (
              <span className="text-[11px] text-[#7f5539] font-mono mt-1 block">
                ≈ 約 NT$ {formatTWD(approxTWD)} (匯率 {exchangeRate})
              </span>
            )}
          </div>

          {/* Optional: 備註 */}
          <div>
            <label className="block text-xs font-semibold text-[#5c4d43] mb-1">
              備註說明 (選填，色號、容量規格等)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="例：色號 02 象牙白、要買一送一組..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#ded7cb] rounded-xl text-[#3e352e] focus:outline-hidden"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-[#e8e2d8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#7d7165] hover:bg-[#ede8df] rounded-xl cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isProcessingImage}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#7f5539] hover:bg-[#68432a] active:scale-[0.98] rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50"
            >
              {editingItem ? '儲存修改' : '新增到清單'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

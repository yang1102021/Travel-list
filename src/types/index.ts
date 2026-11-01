export type ItemFilterStatus = 'all' | 'purchased' | 'unpurchased';

export interface ShoppingItem {
  id: string;
  name: string; // 商品品項
  quantity: number; // 數量
  location: string; // 哪裡買
  buyer: string; // 購買人
  isPurchased: boolean; // 是否已購買
  actualPriceKRW?: number; // 實際結帳金額 (韓元 ₩)
  actualPriceTWD?: number; // 換算台幣 (NT$)
  note?: string; // 備註 (選填，如色號、規格)
  image?: string; // 商品照片 (壓縮後 base64)
  createdAt: number;
}

export interface AppSettings {
  appTitle: string; // 旅遊清單標題 (可自訂編輯，例如：首爾銀杏購物清單、東京購物清單)
  exchangeRate: number; // 1 TWD = X 外幣 (預設 42.0)
}

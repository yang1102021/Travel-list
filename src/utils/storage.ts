import { ShoppingItem, AppSettings } from '../types';

const STORAGE_KEYS = {
  ITEMS: 'seoul_shopping_items_clean_v2',
  SETTINGS: 'seoul_shopping_settings_clean_v2',
  CUSTOM_LOCATIONS: 'seoul_custom_locations_clean_v3',
  CUSTOM_BUYERS: 'seoul_custom_buyers_clean_v3',
};

export const DEFAULT_SETTINGS: AppSettings = {
  appTitle: '首爾銀杏購物清單',
  exchangeRate: 42.0, // 1 TWD ≈ 42.0 KRW
};

export const DEFAULT_LOCATIONS = [
  'Olive Young',
  '大創',
  '藥局',
  '免稅店',
  '樂天超市',
  '便利商店',
];

export const DEFAULT_BUYERS = [
  '自己',
  '媽媽',
];

export const loadStoredItems = (): ShoppingItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) return []; // 內容預設為空，由使用者自行新增
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load items:', err);
    return [];
  }
};

export const saveStoredItems = (items: ShoppingItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save items:', err);
  }
};

export const loadStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
};

export const loadStoredLocations = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LOCATIONS);
    if (!raw) return DEFAULT_LOCATIONS;
    const parsed = JSON.parse(raw);
    // Filter out old locations (弘大商圈, 聖水洞, 明洞, 漢南洞) if present
    const cleaned = parsed.filter(
      (l: string) => !['弘大商圈', '聖水洞', '明洞', '漢南洞', '現代百貨', '大創 Daiso'].includes(l)
    );
    // Ensure 大創, 藥局, 免稅店 exist
    const merged = Array.from(new Set([...DEFAULT_LOCATIONS, ...cleaned]));
    return merged;
  } catch (err) {
    return DEFAULT_LOCATIONS;
  }
};

export const saveStoredLocations = (locations: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LOCATIONS, JSON.stringify(locations));
  } catch (err) {
    console.warn('Failed to save locations:', err);
  }
};

export const loadStoredBuyers = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_BUYERS);
    if (!raw) return DEFAULT_BUYERS;
    const parsed = JSON.parse(raw);
    // Filter out '朋友' and '同事'
    const cleaned = parsed.filter((b: string) => b !== '朋友' && b !== '同事');
    const merged = Array.from(new Set([...DEFAULT_BUYERS, ...cleaned]));
    return merged;
  } catch (err) {
    return DEFAULT_BUYERS;
  }
};

export const saveStoredBuyers = (buyers: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BUYERS, JSON.stringify(buyers));
  } catch (err) {
    console.warn('Failed to save buyers:', err);
  }
};

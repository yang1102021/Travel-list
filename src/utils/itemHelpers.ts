import { ShoppingItem } from '../types';

/**
 * 取得商品的所有購買地點（支援舊版單一字串與新版複選陣列）
 */
export const getItemLocations = (item: Partial<ShoppingItem>): string[] => {
  if (Array.isArray(item.locations) && item.locations.length > 0) {
    return item.locations.filter(Boolean);
  }
  if (item.location && item.location.trim() && item.location !== '未指定') {
    return item.location
      .split(/[、,，/]/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * 將地點陣列格式化為字串以供顯示或舊版相容
 */
export const formatLocationsString = (locations: string[]): string => {
  if (!locations || locations.length === 0) return '未指定';
  return locations.join('、');
};

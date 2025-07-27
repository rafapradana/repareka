import { provinces, cities, getCitiesByProvinceId } from '@/lib/data/indonesia-locations'

export interface Location {
  province: string
  cities: string[]
}

/**
 * Mengkonversi data lokasi Indonesia ke format yang dibutuhkan SearchAndFilter
 */
export function getLocationsForFilter(): Location[] {
  return provinces.map(province => ({
    province: province.name,
    cities: getCitiesByProvinceId(province.id).map(city => city.name)
  }))
}

/**
 * Mendapatkan daftar provinsi saja
 */
export function getProvinceNames(): string[] {
  return provinces.map(province => province.name)
}

/**
 * Mendapatkan daftar kota berdasarkan nama provinsi
 */
export function getCitiesByProvinceName(provinceName: string): string[] {
  const province = provinces.find(p => p.name === provinceName)
  if (!province) return []
  
  return getCitiesByProvinceId(province.id).map(city => city.name)
}
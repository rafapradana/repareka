/**
 * Data provinsi dan kota/kabupaten Indonesia
 * Untuk dropdown component dalam form registrasi customer
 */

export interface Province {
  id: string
  name: string
}

export interface City {
  id: string
  name: string
  provinceId: string
}

export const provinces: Province[] = [
  { id: '11', name: 'Aceh' },
  { id: '12', name: 'Sumatera Utara' },
  { id: '13', name: 'Sumatera Barat' },
  { id: '14', name: 'Riau' },
  { id: '15', name: 'Jambi' },
  { id: '16', name: 'Sumatera Selatan' },
  { id: '17', name: 'Bengkulu' },
  { id: '18', name: 'Lampung' },
  { id: '19', name: 'Kepulauan Bangka Belitung' },
  { id: '21', name: 'Kepulauan Riau' },
  { id: '31', name: 'DKI Jakarta' },
  { id: '32', name: 'Jawa Barat' },
  { id: '33', name: 'Jawa Tengah' },
  { id: '34', name: 'DI Yogyakarta' },
  { id: '35', name: 'Jawa Timur' },
  { id: '36', name: 'Banten' },
  { id: '51', name: 'Bali' },
  { id: '52', name: 'Nusa Tenggara Barat' },
  { id: '53', name: 'Nusa Tenggara Timur' },
  { id: '61', name: 'Kalimantan Barat' },
  { id: '62', name: 'Kalimantan Tengah' },
  { id: '63', name: 'Kalimantan Selatan' },
  { id: '64', name: 'Kalimantan Timur' },
  { id: '65', name: 'Kalimantan Utara' },
  { id: '71', name: 'Sulawesi Utara' },
  { id: '72', name: 'Sulawesi Tengah' },
  { id: '73', name: 'Sulawesi Selatan' },
  { id: '74', name: 'Sulawesi Tenggara' },
  { id: '75', name: 'Gorontalo' },
  { id: '76', name: 'Sulawesi Barat' },
  { id: '81', name: 'Maluku' },
  { id: '82', name: 'Maluku Utara' },
  { id: '91', name: 'Papua Barat' },
  { id: '94', name: 'Papua' },
]

// Sample cities untuk beberapa provinsi utama
export const cities: City[] = [
  // DKI Jakarta
  { id: '3101', name: 'Jakarta Selatan', provinceId: '31' },
  { id: '3102', name: 'Jakarta Timur', provinceId: '31' },
  { id: '3103', name: 'Jakarta Pusat', provinceId: '31' },
  { id: '3104', name: 'Jakarta Barat', provinceId: '31' },
  { id: '3105', name: 'Jakarta Utara', provinceId: '31' },
  
  // Jawa Barat
  { id: '3201', name: 'Bogor', provinceId: '32' },
  { id: '3202', name: 'Sukabumi', provinceId: '32' },
  { id: '3203', name: 'Cianjur', provinceId: '32' },
  { id: '3204', name: 'Bandung', provinceId: '32' },
  { id: '3205', name: 'Garut', provinceId: '32' },
  { id: '3206', name: 'Tasikmalaya', provinceId: '32' },
  { id: '3207', name: 'Ciamis', provinceId: '32' },
  { id: '3208', name: 'Kuningan', provinceId: '32' },
  { id: '3209', name: 'Cirebon', provinceId: '32' },
  { id: '3210', name: 'Majalengka', provinceId: '32' },
  { id: '3211', name: 'Sumedang', provinceId: '32' },
  { id: '3212', name: 'Indramayu', provinceId: '32' },
  { id: '3213', name: 'Subang', provinceId: '32' },
  { id: '3214', name: 'Purwakarta', provinceId: '32' },
  { id: '3215', name: 'Karawang', provinceId: '32' },
  { id: '3216', name: 'Bekasi', provinceId: '32' },
  { id: '3217', name: 'Bandung Barat', provinceId: '32' },
  { id: '3271', name: 'Kota Bogor', provinceId: '32' },
  { id: '3272', name: 'Kota Sukabumi', provinceId: '32' },
  { id: '3273', name: 'Kota Bandung', provinceId: '32' },
  { id: '3274', name: 'Kota Cirebon', provinceId: '32' },
  { id: '3275', name: 'Kota Bekasi', provinceId: '32' },
  { id: '3276', name: 'Kota Depok', provinceId: '32' },
  { id: '3277', name: 'Kota Cimahi', provinceId: '32' },
  { id: '3278', name: 'Kota Tasikmalaya', provinceId: '32' },
  { id: '3279', name: 'Kota Banjar', provinceId: '32' },
  
  // Jawa Tengah
  { id: '3301', name: 'Cilacap', provinceId: '33' },
  { id: '3302', name: 'Banyumas', provinceId: '33' },
  { id: '3303', name: 'Purbalingga', provinceId: '33' },
  { id: '3304', name: 'Banjarnegara', provinceId: '33' },
  { id: '3305', name: 'Kebumen', provinceId: '33' },
  { id: '3306', name: 'Purworejo', provinceId: '33' },
  { id: '3307', name: 'Wonosobo', provinceId: '33' },
  { id: '3308', name: 'Magelang', provinceId: '33' },
  { id: '3309', name: 'Boyolali', provinceId: '33' },
  { id: '3310', name: 'Klaten', provinceId: '33' },
  { id: '3311', name: 'Sukoharjo', provinceId: '33' },
  { id: '3312', name: 'Wonogiri', provinceId: '33' },
  { id: '3313', name: 'Karanganyar', provinceId: '33' },
  { id: '3314', name: 'Sragen', provinceId: '33' },
  { id: '3315', name: 'Grobogan', provinceId: '33' },
  { id: '3316', name: 'Blora', provinceId: '33' },
  { id: '3317', name: 'Rembang', provinceId: '33' },
  { id: '3318', name: 'Pati', provinceId: '33' },
  { id: '3319', name: 'Kudus', provinceId: '33' },
  { id: '3320', name: 'Jepara', provinceId: '33' },
  { id: '3321', name: 'Demak', provinceId: '33' },
  { id: '3322', name: 'Semarang', provinceId: '33' },
  { id: '3323', name: 'Temanggung', provinceId: '33' },
  { id: '3324', name: 'Kendal', provinceId: '33' },
  { id: '3325', name: 'Batang', provinceId: '33' },
  { id: '3326', name: 'Pekalongan', provinceId: '33' },
  { id: '3327', name: 'Pemalang', provinceId: '33' },
  { id: '3328', name: 'Tegal', provinceId: '33' },
  { id: '3329', name: 'Brebes', provinceId: '33' },
  { id: '3371', name: 'Kota Magelang', provinceId: '33' },
  { id: '3372', name: 'Kota Surakarta', provinceId: '33' },
  { id: '3373', name: 'Kota Salatiga', provinceId: '33' },
  { id: '3374', name: 'Kota Semarang', provinceId: '33' },
  { id: '3375', name: 'Kota Pekalongan', provinceId: '33' },
  { id: '3376', name: 'Kota Tegal', provinceId: '33' },
  
  // Jawa Timur
  { id: '3501', name: 'Pacitan', provinceId: '35' },
  { id: '3502', name: 'Ponorogo', provinceId: '35' },
  { id: '3503', name: 'Trenggalek', provinceId: '35' },
  { id: '3504', name: 'Tulungagung', provinceId: '35' },
  { id: '3505', name: 'Blitar', provinceId: '35' },
  { id: '3506', name: 'Kediri', provinceId: '35' },
  { id: '3507', name: 'Malang', provinceId: '35' },
  { id: '3508', name: 'Lumajang', provinceId: '35' },
  { id: '3509', name: 'Jember', provinceId: '35' },
  { id: '3510', name: 'Banyuwangi', provinceId: '35' },
  { id: '3511', name: 'Bondowoso', provinceId: '35' },
  { id: '3512', name: 'Situbondo', provinceId: '35' },
  { id: '3513', name: 'Probolinggo', provinceId: '35' },
  { id: '3514', name: 'Pasuruan', provinceId: '35' },
  { id: '3515', name: 'Sidoarjo', provinceId: '35' },
  { id: '3516', name: 'Mojokerto', provinceId: '35' },
  { id: '3517', name: 'Jombang', provinceId: '35' },
  { id: '3518', name: 'Nganjuk', provinceId: '35' },
  { id: '3519', name: 'Madiun', provinceId: '35' },
  { id: '3520', name: 'Magetan', provinceId: '35' },
  { id: '3521', name: 'Ngawi', provinceId: '35' },
  { id: '3522', name: 'Bojonegoro', provinceId: '35' },
  { id: '3523', name: 'Tuban', provinceId: '35' },
  { id: '3524', name: 'Lamongan', provinceId: '35' },
  { id: '3525', name: 'Gresik', provinceId: '35' },
  { id: '3526', name: 'Bangkalan', provinceId: '35' },
  { id: '3527', name: 'Sampang', provinceId: '35' },
  { id: '3528', name: 'Pamekasan', provinceId: '35' },
  { id: '3529', name: 'Sumenep', provinceId: '35' },
  { id: '3571', name: 'Kota Kediri', provinceId: '35' },
  { id: '3572', name: 'Kota Blitar', provinceId: '35' },
  { id: '3573', name: 'Kota Malang', provinceId: '35' },
  { id: '3574', name: 'Kota Probolinggo', provinceId: '35' },
  { id: '3575', name: 'Kota Pasuruan', provinceId: '35' },
  { id: '3576', name: 'Kota Mojokerto', provinceId: '35' },
  { id: '3577', name: 'Kota Madiun', provinceId: '35' },
  { id: '3578', name: 'Kota Surabaya', provinceId: '35' },
  { id: '3579', name: 'Kota Batu', provinceId: '35' },
  
  // Bali
  { id: '5101', name: 'Jembrana', provinceId: '51' },
  { id: '5102', name: 'Tabanan', provinceId: '51' },
  { id: '5103', name: 'Badung', provinceId: '51' },
  { id: '5104', name: 'Gianyar', provinceId: '51' },
  { id: '5105', name: 'Klungkung', provinceId: '51' },
  { id: '5106', name: 'Bangli', provinceId: '51' },
  { id: '5107', name: 'Karangasem', provinceId: '51' },
  { id: '5108', name: 'Buleleng', provinceId: '51' },
  { id: '5171', name: 'Kota Denpasar', provinceId: '51' },
]

/**
 * Utility functions untuk location data
 */
export function getProvinceById(id: string): Province | undefined {
  return provinces.find(province => province.id === id)
}

export function getCitiesByProvinceId(provinceId: string): City[] {
  return cities.filter(city => city.provinceId === provinceId)
}

export function getCityById(id: string): City | undefined {
  return cities.find(city => city.id === id)
}

export function getProvinceByName(name: string): Province | undefined {
  return provinces.find(province => province.name.toLowerCase() === name.toLowerCase())
}

export function getCityByName(name: string, provinceId?: string): City | undefined {
  const filteredCities = provinceId 
    ? cities.filter(city => city.provinceId === provinceId)
    : cities
  
  return filteredCities.find(city => city.name.toLowerCase() === name.toLowerCase())
}
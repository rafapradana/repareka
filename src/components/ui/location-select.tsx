'use client'

import * as React from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  provinces, 
  getCitiesByProvinceId, 
  type Province, 
  type City 
} from "@/lib/data/indonesia-locations"

interface ProvinceSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ProvinceSelect({ 
  value, 
  onValueChange, 
  placeholder = "Pilih Provinsi",
  disabled = false 
}: ProvinceSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {provinces.map((province: Province) => (
          <SelectItem key={province.id} value={province.id}>
            {province.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface CitySelectProps {
  provinceId?: string
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function CitySelect({ 
  provinceId, 
  value, 
  onValueChange, 
  placeholder = "Pilih Kota/Kabupaten",
  disabled = false 
}: CitySelectProps) {
  const cities = React.useMemo(() => {
    return provinceId ? getCitiesByProvinceId(provinceId) : []
  }, [provinceId])

  // Reset city value when province changes
  React.useEffect(() => {
    if (value && !cities.find(city => city.id === value)) {
      onValueChange('')
    }
  }, [cities, value, onValueChange])

  return (
    <Select 
      value={value} 
      onValueChange={onValueChange} 
      disabled={disabled || !provinceId || cities.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder={
          !provinceId 
            ? "Pilih provinsi terlebih dahulu" 
            : cities.length === 0 
              ? "Tidak ada kota tersedia"
              : placeholder
        } />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city: City) => (
          <SelectItem key={city.id} value={city.id}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface LocationSelectProps {
  provinceValue?: string
  cityValue?: string
  onProvinceChange: (value: string) => void
  onCityChange: (value: string) => void
  provincePlaceholder?: string
  cityPlaceholder?: string
  disabled?: boolean
}

export function LocationSelect({
  provinceValue,
  cityValue,
  onProvinceChange,
  onCityChange,
  provincePlaceholder = "Pilih Provinsi",
  cityPlaceholder = "Pilih Kota/Kabupaten",
  disabled = false
}: LocationSelectProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <ProvinceSelect
          value={provinceValue}
          onValueChange={onProvinceChange}
          placeholder={provincePlaceholder}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <CitySelect
          provinceId={provinceValue}
          value={cityValue}
          onValueChange={onCityChange}
          placeholder={cityPlaceholder}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Building2, Mail, Phone, MapPin, User } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { provinces, getCitiesByProvinceId, type City } from '@/lib/data/indonesia-locations'
import type { MitraRegisterData, LoginCredentials } from '@/lib/auth/types'

// Schema validasi untuk login mitra
const mitraLoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
})

// Schema validasi untuk registrasi mitra
const mitraRegisterSchema = z.object({
  email: z.string().email('Email tidak valid'),
  businessName: z.string().min(2, 'Nama bisnis minimal 2 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^[0-9+\-\s()]+$/, 'Format nomor telepon tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirmPassword: z.string(),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  province: z.string().min(1, 'Pilih provinsi'),
  city: z.string().min(1, 'Pilih kota/kabupaten'),
  businessType: z.enum(['individual', 'small_business', 'company'], {
    message: 'Pilih jenis bisnis'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword']
})

type MitraLoginForm = z.infer<typeof mitraLoginSchema>
type MitraRegisterForm = z.infer<typeof mitraRegisterSchema>

interface MitraAuthFormProps {
  mode: 'login' | 'register'
  onSuccess?: () => void
  onError?: (error: string) => void
  onModeChange?: (mode: 'login' | 'register') => void
}

export function MitraAuthForm({ mode, onSuccess, onError, onModeChange }: MitraAuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [availableCities, setAvailableCities] = useState<City[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, registerAsMitra } = useAuthContext()

  // Form untuk login
  const loginForm = useForm<MitraLoginForm>({
    resolver: zodResolver(mitraLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Form untuk registrasi
  const registerForm = useForm<MitraRegisterForm>({
    resolver: zodResolver(mitraRegisterSchema),
    defaultValues: {
      email: '',
      businessName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      province: '',
      city: '',
      businessType: 'individual'
    }
  })

  // Handle perubahan provinsi
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId)
    const cities = getCitiesByProvinceId(provinceId)
    setAvailableCities(cities)
    registerForm.setValue('province', provinceId)
    registerForm.setValue('city', '') // Reset city selection
  }

  // Handle login submit
  const handleLoginSubmit = async (data: MitraLoginForm) => {
    try {
      setIsSubmitting(true)
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password
      }
      
      await login(credentials)
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat login'
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle register submit
  const handleRegisterSubmit = async (data: MitraRegisterForm) => {
    try {
      setIsSubmitting(true)
      const registerData: MitraRegisterData = {
        email: data.email,
        businessName: data.businessName,
        phone: data.phone,
        password: data.password,
        address: data.address,
        province: data.province,
        city: data.city,
        businessType: data.businessType
      }
      
      await registerAsMitra(registerData)
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi'
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (mode === 'login') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-base-900">Login Mitra</h2>
          <p className="text-base-600 mt-2">Masuk ke dashboard mitra Anda</p>
        </div>

        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-base-700 mb-2">
              Email Bisnis
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-400" />
              </div>
              <input
                {...loginForm.register('email')}
                type="email"
                id="email"
                className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="email@bisnis.com"
                disabled={isSubmitting}
              />
            </div>
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-base-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...loginForm.register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="block w-full pr-10 pl-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Masukkan password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-base-400" />
                ) : (
                  <Eye className="h-5 w-5 text-base-400" />
                )}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>

          {/* Switch to Register */}
          <div className="text-center">
            <p className="text-sm text-base-600">
              Belum punya akun mitra?{' '}
              <button
                type="button"
                onClick={() => onModeChange?.('register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
                disabled={isSubmitting}
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-base-900">Daftar Mitra</h2>
        <p className="text-base-600 mt-2">Bergabung sebagai penyedia jasa reparasi</p>
      </div>

      <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="md:col-span-2">
            <label htmlFor="reg-email" className="block text-sm font-medium text-base-700 mb-2">
              Email Bisnis *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-400" />
              </div>
              <input
                {...registerForm.register('email')}
                type="email"
                id="reg-email"
                className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="email@bisnis.com"
                disabled={isSubmitting}
              />
            </div>
            {registerForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
            )}
          </div>

          {/* Business Name Field */}
          <div className="md:col-span-2">
            <label htmlFor="businessName" className="block text-sm font-medium text-base-700 mb-2">
              Nama Bisnis *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-base-400" />
              </div>
              <input
                {...registerForm.register('businessName')}
                type="text"
                id="businessName"
                className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Nama bisnis atau toko Anda"
                disabled={isSubmitting}
              />
            </div>
            {registerForm.formState.errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.businessName.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-base-700 mb-2">
              Nomor Telepon *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-base-400" />
              </div>
              <input
                {...registerForm.register('phone')}
                type="tel"
                id="phone"
                className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="08123456789"
                disabled={isSubmitting}
              />
            </div>
            {registerForm.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Business Type Field */}
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-base-700 mb-2">
              Jenis Bisnis *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-base-400" />
              </div>
              <select
                {...registerForm.register('businessType')}
                id="businessType"
                className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
                disabled={isSubmitting}
              >
                <option value="individual">Perorangan</option>
                <option value="small_business">Usaha Kecil</option>
                <option value="company">Perusahaan</option>
              </select>
            </div>
            {registerForm.formState.errors.businessType && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.businessType.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-base-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                {...registerForm.register('password')}
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                className="block w-full pr-10 pl-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Minimal 8 karakter"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-base-400" />
                ) : (
                  <Eye className="h-5 w-5 text-base-400" />
                )}
              </button>
            </div>
            {registerForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-700 mb-2">
              Konfirmasi Password *
            </label>
            <div className="relative">
              <input
                {...registerForm.register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="block w-full pr-10 pl-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Ulangi password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-base-400" />
                ) : (
                  <Eye className="h-5 w-5 text-base-400" />
                )}
              </button>
            </div>
            {registerForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Address Field */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-base-700 mb-2">
              Alamat Lengkap *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-base-400" />
              </div>
              <textarea
                {...registerForm.register('address')}
                id="address"
                rows={3}
                className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                placeholder="Alamat lengkap bisnis Anda"
                disabled={isSubmitting}
              />
            </div>
            {registerForm.formState.errors.address && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.address.message}</p>
            )}
          </div>

          {/* Province Field */}
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-base-700 mb-2">
              Provinsi *
            </label>
            <select
              {...registerForm.register('province')}
              id="province"
              className="block w-full px-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
              onChange={(e) => handleProvinceChange(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {registerForm.formState.errors.province && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.province.message}</p>
            )}
          </div>

          {/* City Field */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-base-700 mb-2">
              Kota/Kabupaten *
            </label>
            <select
              {...registerForm.register('city')}
              id="city"
              className="block w-full px-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
              disabled={isSubmitting || !selectedProvince}
            >
              <option value="">Pilih Kota/Kabupaten</option>
              {availableCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {registerForm.formState.errors.city && (
              <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-base-50 p-4 rounded-lg">
          <p className="text-sm text-base-600">
            Dengan mendaftar sebagai mitra, Anda menyetujui{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Syarat dan Ketentuan
            </a>{' '}
            serta{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Kebijakan Privasi
            </a>{' '}
            Repareka. Akun Anda akan diverifikasi dalam 1-3 hari kerja.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Memproses...' : 'Daftar Sebagai Mitra'}
        </button>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-sm text-base-600">
            Sudah punya akun mitra?{' '}
            <button
              type="button"
              onClick={() => onModeChange?.('login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
              disabled={isSubmitting}
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
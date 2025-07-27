'use client'

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Mail, User, Lock, Phone, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationSelect } from "@/components/ui/location-select"
import { AuthFormSkeleton } from "@/components/ui/LoadingSkeleton"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/Toast"
import { useRetry } from "@/hooks/useRetry"
import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { classifyError } from "@/lib/utils/errorHandler"
import { 
  loginSchema, 
  customerRegisterSchema, 
  type LoginFormData, 
  type CustomerRegisterFormData 
} from "@/lib/validations/auth"
import { 
  getProvinceById, 
  getCityById 
} from "@/lib/data/indonesia-locations"
import { cn } from "@/lib/utils"

interface CustomerAuthFormProps {
  mode: 'login' | 'register'
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectUrl?: string
  className?: string
}

export function CustomerAuthForm({ 
  mode, 
  onSuccess, 
  onError,
  className 
}: CustomerAuthFormProps) {
  const { login, registerAsCustomer, loading } = useAuth()
  const { addToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<Error | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form untuk login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Form untuk register
  const registerForm = useForm<CustomerRegisterFormData>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      province: '',
      city: '',
      phone: '',
    },
  })

  // Helper function untuk mendapatkan register function yang tepat
  const getRegister = (fieldName: string) => {
    if (mode === 'login') {
      return loginForm.register(fieldName as keyof LoginFormData)
    } else {
      return registerForm.register(fieldName as keyof CustomerRegisterFormData)
    }
  }

  // Helper function untuk mendapatkan form errors yang tepat
  const getErrors = () => {
    return mode === 'login' ? loginForm.formState.errors : registerForm.formState.errors
  }

  // Retry mechanism untuk login
  const loginWithRetry = useRetry(
    async (data: LoginFormData) => {
      await login(data)
    },
    {
      maxAttempts: 3,
      delay: 1000,
      shouldRetry: (error, attempt) => {
        const classified = classifyError(error)
        return classified.isRetryable && attempt < 3
      },
      onRetry: (attempt, error) => {
        const classified = classifyError(error)
        if (classified.type === 'network') {
          addToast({
            type: 'warning',
            title: 'Koneksi Bermasalah',
            message: `Mencoba login lagi... (${attempt}/3)`
          })
        }
      }
    }
  )

  // Retry mechanism untuk register
  const registerWithRetry = useRetry(
    async (data: CustomerRegisterFormData) => {
      // Convert province and city IDs to names
      const province = getProvinceById(data.province)
      const city = getCityById(data.city)
      
      if (!province || !city) {
        throw new Error('Data lokasi tidak valid')
      }

      await registerAsCustomer({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        province: province.name,
        city: city.name,
        phone: data.phone || undefined,
      })
    },
    {
      maxAttempts: 3,
      delay: 1000,
      shouldRetry: (error, attempt) => {
        const classified = classifyError(error)
        return classified.isRetryable && attempt < 3
      },
      onRetry: (attempt, error) => {
        const classified = classifyError(error)
        if (classified.type === 'network') {
          addToast({
            type: 'warning',
            title: 'Koneksi Bermasalah',
            message: `Mencoba registrasi lagi... (${attempt}/3)`
          })
        }
      }
    }
  )

  // Handle login submit
  const handleLoginSubmit = async (data: LoginFormData) => {
    if (!isOnline) {
      const error = new Error('Tidak ada koneksi internet')
      setSubmitError(error)
      addToast({
        type: 'error',
        title: 'Tidak Ada Koneksi',
        message: 'Periksa koneksi internet Anda dan coba lagi'
      })
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await loginWithRetry.execute(data)
      
      addToast({
        type: 'success',
        title: 'Login Berhasil',
        message: 'Selamat datang kembali!'
      })
      
      onSuccess?.()
    } catch (error) {
      const err = error as Error
      const classified = classifyError(err)
      
      setSubmitError(err)
      
      addToast({
        type: 'error',
        title: 'Login Gagal',
        message: classified.message
      })
      
      onError?.(classified.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle register submit
  const handleRegisterSubmit = async (data: CustomerRegisterFormData) => {
    if (!isOnline) {
      const error = new Error('Tidak ada koneksi internet')
      setSubmitError(error)
      addToast({
        type: 'error',
        title: 'Tidak Ada Koneksi',
        message: 'Periksa koneksi internet Anda dan coba lagi'
      })
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await registerWithRetry.execute(data)
      
      addToast({
        type: 'success',
        title: 'Registrasi Berhasil',
        message: 'Silakan cek email Anda untuk verifikasi akun'
      })
      
      onSuccess?.()
    } catch (error) {
      const err = error as Error
      const classified = classifyError(err)
      
      setSubmitError(err)
      
      addToast({
        type: 'error',
        title: 'Registrasi Gagal',
        message: classified.message
      })
      
      onError?.(classified.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'login') {
      loginForm.handleSubmit(handleLoginSubmit)(e)
    } else {
      registerForm.handleSubmit(handleRegisterSubmit)(e)
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Clear errors when mode changes
  React.useEffect(() => {
    setSubmitError(null)
    loginForm.clearErrors()
    registerForm.clearErrors()
  }, [mode, loginForm, registerForm])

  return (
    <div className={cn("w-full", className)}>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className="pl-10"
              {...getRegister('email')}
              disabled={loading}
            />
          </div>
          {getErrors().email && (
            <p className="text-sm text-red-600">
              {getErrors().email?.message}
            </p>
          )}
        </div>

        {/* Full Name Field (Register only) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Nama lengkap Anda"
                className="pl-10"
                {...getRegister('fullName')}
                disabled={loading}
              />
            </div>
            {mode === 'register' && registerForm.formState.errors.fullName && (
              <p className="text-sm text-red-600">
                {registerForm.formState.errors.fullName?.message}
              </p>
            )}
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password Anda"
              className="pl-10 pr-10"
              {...getRegister('password')}
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {getErrors().password && (
            <p className="text-sm text-red-600">
              {getErrors().password?.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field (Register only) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi password Anda"
                className="pl-10 pr-10"
                {...getRegister('confirmPassword')}
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === 'register' && registerForm.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {registerForm.formState.errors.confirmPassword?.message}
              </p>
            )}
          </div>
        )}

        {/* Location Fields (Register only) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4 z-10" />
              <div className="pl-10">
                <LocationSelect
                  provinceValue={mode === 'register' ? registerForm.watch('province') : ''}
                  cityValue={mode === 'register' ? registerForm.watch('city') : ''}
                  onProvinceChange={(value) => {
                    if (mode === 'register') {
                      registerForm.setValue('province', value)
                      registerForm.setValue('city', '') // Reset city when province changes
                    }
                  }}
                  onCityChange={(value) => {
                    if (mode === 'register') {
                      registerForm.setValue('city', value)
                    }
                  }}
                  disabled={loading}
                />
              </div>
            </div>
            {mode === 'register' && (registerForm.formState.errors.province || registerForm.formState.errors.city) && (
              <p className="text-sm text-red-600">
                {registerForm.formState.errors.province?.message || 
                 registerForm.formState.errors.city?.message}
              </p>
            )}
          </div>
        )}

        {/* Phone Field (Register only, optional) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                className="pl-10"
                {...getRegister('phone')}
                disabled={loading}
              />
            </div>
            {mode === 'register' && registerForm.formState.errors.phone && (
              <p className="text-sm text-red-600">
                {registerForm.formState.errors.phone?.message}
              </p>
            )}
          </div>
        )}

        {/* Network Status Warning */}
        {!isOnline && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-600">
                Tidak ada koneksi internet. Periksa koneksi Anda.
              </p>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-600">
                  {classifyError(submitError).message}
                </p>
                {classifyError(submitError).isRetryable && (
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === 'login') {
                        loginForm.handleSubmit(handleLoginSubmit)()
                      } else {
                        registerForm.handleSubmit(handleRegisterSubmit)()
                      }
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    disabled={isSubmitting || !isOnline}
                  >
                    Coba Lagi
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading || isSubmitting || !isOnline}
        >
          {(loading || isSubmitting) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'login' ? 'Masuk...' : 'Mendaftar...'}
            </>
          ) : !isOnline ? (
            'Tidak Ada Koneksi'
          ) : (
            mode === 'login' ? 'Masuk' : 'Daftar'
          )}
        </Button>


      </form>

      {/* Email Verification Notice (Register only) */}
      {mode === 'register' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">
            Setelah mendaftar, Anda akan menerima email verifikasi. 
            Silakan cek email Anda dan klik link verifikasi untuk mengaktifkan akun.
          </p>
        </div>
      )}
    </div>
  )
}
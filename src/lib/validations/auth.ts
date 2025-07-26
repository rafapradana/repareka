import { z } from "zod"
import { isValidEmail, isValidPhoneNumber } from "@/lib/utils"

/**
 * Schema validasi untuk form authentication
 */

// Schema untuk login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .refine(isValidEmail, "Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
})

// Schema untuk registrasi customer
export const customerRegisterSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .refine(isValidEmail, "Format email tidak valid"),
  fullName: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/\d/, "Password harus mengandung angka"),
  confirmPassword: z
    .string()
    .min(1, "Konfirmasi password wajib diisi"),
  province: z
    .string()
    .min(1, "Provinsi wajib dipilih"),
  city: z
    .string()
    .min(1, "Kota/Kabupaten wajib dipilih"),
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true
      return isValidPhoneNumber(phone)
    }, "Format nomor telepon tidak valid"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
})

// Schema untuk registrasi mitra
export const mitraRegisterSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .refine(isValidEmail, "Format email tidak valid"),
  businessName: z
    .string()
    .min(1, "Nama bisnis wajib diisi")
    .min(2, "Nama bisnis minimal 2 karakter")
    .max(100, "Nama bisnis maksimal 100 karakter"),
  phone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .refine(isValidPhoneNumber, "Format nomor telepon tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/\d/, "Password harus mengandung angka"),
  confirmPassword: z
    .string()
    .min(1, "Konfirmasi password wajib diisi"),
  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(10, "Alamat minimal 10 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
  province: z
    .string()
    .min(1, "Provinsi wajib dipilih"),
  city: z
    .string()
    .min(1, "Kota/Kabupaten wajib dipilih"),
  businessType: z
    .enum(['individual', 'small_business', 'company'], {
      message: "Jenis bisnis wajib dipilih",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
})

// Types dari schema
export type LoginFormData = z.infer<typeof loginSchema>
export type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>
export type MitraRegisterFormData = z.infer<typeof mitraRegisterSchema>
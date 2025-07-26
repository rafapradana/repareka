'use client'

import React from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone } from 'lucide-react'
import type { Mitra } from '@/lib/auth/types'

interface MitraVerificationStatusProps {
  mitra: Mitra
  onLogout?: () => void
}

export function MitraVerificationStatus({ mitra, onLogout }: MitraVerificationStatusProps) {
  const getStatusConfig = () => {
    switch (mitra.verification_status) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Akun Sedang Diverifikasi',
          message: 'Akun mitra Anda sedang dalam proses verifikasi oleh tim kami. Proses ini biasanya memakan waktu 1-3 hari kerja.',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200'
        }
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Verifikasi Ditolak',
          message: 'Maaf, verifikasi akun mitra Anda ditolak. Silakan hubungi tim support untuk informasi lebih lanjut.',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200'
        }
      case 'approved':
        return {
          icon: CheckCircle,
          title: 'Akun Terverifikasi',
          message: 'Selamat! Akun mitra Anda telah terverifikasi dan aktif.',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        }
      default:
        return {
          icon: AlertCircle,
          title: 'Status Tidak Diketahui',
          message: 'Status verifikasi akun Anda tidak dapat ditentukan. Silakan hubungi support.',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-base-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Status Card */}
        <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-6 mb-6`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <StatusIcon className={`w-8 h-8 ${statusConfig.iconColor}`} />
            </div>
            <h2 className="text-xl font-display font-bold text-base-900 mb-2">
              {statusConfig.title}
            </h2>
            <p className="text-base-600 text-sm leading-relaxed">
              {statusConfig.message}
            </p>
          </div>
        </div>

        {/* Business Info Card */}
        <div className="bg-white rounded-lg border border-base-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-base-900 mb-4">Informasi Bisnis</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                <Mail className="w-4 h-4 text-base-600" />
              </div>
              <div>
                <p className="text-base-500 text-xs">Email</p>
                <p className="text-base-900 font-medium">{mitra.email}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                <Phone className="w-4 h-4 text-base-600" />
              </div>
              <div>
                <p className="text-base-500 text-xs">Telepon</p>
                <p className="text-base-900 font-medium">{mitra.phone}</p>
              </div>
            </div>
            <div className="flex items-start text-sm">
              <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <div className="w-2 h-2 bg-base-600 rounded-full" />
              </div>
              <div>
                <p className="text-base-500 text-xs">Nama Bisnis</p>
                <p className="text-base-900 font-medium">{mitra.business_name}</p>
              </div>
            </div>
            <div className="flex items-start text-sm">
              <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <div className="w-2 h-2 bg-base-600 rounded-full" />
              </div>
              <div>
                <p className="text-base-500 text-xs">Alamat</p>
                <p className="text-base-900 font-medium">{mitra.address}</p>
                <p className="text-base-500 text-xs">{mitra.city}, {mitra.province}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {mitra.verification_status === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Yang Perlu Anda Lakukan:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pastikan email Anda aktif untuk menerima notifikasi</li>
                <li>• Siapkan dokumen pendukung jika diminta</li>
                <li>• Tunggu konfirmasi dari tim verifikasi kami</li>
              </ul>
            </div>
          )}

          {mitra.verification_status === 'rejected' && (
            <div className="space-y-3">
              <a
                href="mailto:support@repareka.com?subject=Verifikasi Mitra Ditolak"
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center block"
              >
                Hubungi Support
              </a>
              <a
                href="tel:+6281234567890"
                className="w-full bg-white text-primary-600 py-3 px-4 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center block"
              >
                Telepon Support
              </a>
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full bg-base-100 text-base-700 py-3 px-4 rounded-lg font-medium hover:bg-base-200 focus:ring-2 focus:ring-base-500 focus:ring-offset-2 transition-colors"
          >
            Keluar
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-base-500">
            Butuh bantuan? Hubungi kami di{' '}
            <a href="mailto:support@repareka.com" className="text-primary-600 hover:text-primary-700">
              support@repareka.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
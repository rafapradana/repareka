/**
 * Sistem notifikasi untuk admin saat ada registrasi mitra baru
 */

import type { Mitra } from '@/lib/auth/types'

interface AdminNotificationData {
  type: 'mitra_registration'
  mitra: Mitra
  timestamp: string
}

/**
 * Mengirim notifikasi email ke admin saat ada registrasi mitra baru
 */
export async function notifyAdminNewMitraRegistration(mitra: Mitra): Promise<void> {
  try {
    const notificationData: AdminNotificationData = {
      type: 'mitra_registration',
      mitra,
      timestamp: new Date().toISOString()
    }

    // Untuk saat ini, kita akan log ke console
    // Dalam implementasi production, ini bisa menggunakan service email seperti:
    // - Supabase Edge Functions untuk mengirim email
    // - Third-party service seperti SendGrid, Mailgun, dll
    // - Webhook ke sistem notifikasi internal
    
    console.log('🔔 Admin Notification: New Mitra Registration', {
      businessName: mitra.business_name,
      email: mitra.email,
      phone: mitra.phone,
      businessType: mitra.business_type,
      location: `${mitra.city}, ${mitra.province}`,
      registrationTime: notificationData.timestamp
    })

    // Simulasi pengiriman email ke admin
    await sendEmailToAdmin(notificationData)
    
    // Simulasi penyimpanan notifikasi ke database untuk admin dashboard
    await saveAdminNotification(notificationData)

  } catch (error) {
    console.error('Error sending admin notification:', error)
    // Jangan throw error agar tidak mengganggu proses registrasi mitra
  }
}

/**
 * Simulasi pengiriman email ke admin
 * Dalam implementasi nyata, ini akan menggunakan service email
 */
async function sendEmailToAdmin(data: AdminNotificationData): Promise<void> {
  // Simulasi delay pengiriman email
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const emailContent = generateAdminEmailContent(data)
  
  console.log('📧 Email sent to admin:', {
    to: 'admin@repareka.com',
    subject: emailContent.subject,
    body: emailContent.body
  })
}

/**
 * Generate konten email untuk admin
 */
function generateAdminEmailContent(data: AdminNotificationData) {
  const { mitra } = data
  
  return {
    subject: `[Repareka] Registrasi Mitra Baru - ${mitra.business_name}`,
    body: `
Halo Admin,

Ada registrasi mitra baru yang perlu diverifikasi:

INFORMASI MITRA:
- Nama Bisnis: ${mitra.business_name}
- Email: ${mitra.email}
- Telepon: ${mitra.phone}
- Jenis Bisnis: ${mitra.business_type === 'individual' ? 'Perorangan' : 
                 mitra.business_type === 'small_business' ? 'Usaha Kecil' : 'Perusahaan'}
- Alamat: ${mitra.address}
- Lokasi: ${mitra.city}, ${mitra.province}
- Waktu Registrasi: ${new Date(data.timestamp).toLocaleString('id-ID')}

STATUS: Menunggu Verifikasi

Silakan login ke admin dashboard untuk melakukan verifikasi:
https://repareka.com/admin/mitra-verification

Terima kasih,
Sistem Repareka
    `.trim()
  }
}

/**
 * Simulasi penyimpanan notifikasi ke database
 * Dalam implementasi nyata, ini akan menyimpan ke tabel admin_notifications
 */
async function saveAdminNotification(data: AdminNotificationData): Promise<void> {
  // Simulasi delay penyimpanan database
  await new Promise(resolve => setTimeout(resolve, 50))
  
  console.log('💾 Admin notification saved to database:', {
    id: `notif_${Date.now()}`,
    type: data.type,
    title: `Registrasi Mitra Baru: ${data.mitra.business_name}`,
    message: `Mitra baru ${data.mitra.business_name} telah mendaftar dan menunggu verifikasi`,
    isRead: false,
    createdAt: data.timestamp,
    metadata: {
      mitraId: data.mitra.id,
      mitraEmail: data.mitra.email,
      mitraBusinessName: data.mitra.business_name
    }
  })
}

/**
 * Mengirim notifikasi WhatsApp ke admin (opsional)
 * Bisa digunakan untuk notifikasi real-time yang lebih cepat
 */
export async function notifyAdminViaWhatsApp(mitra: Mitra): Promise<void> {
  try {
    // Simulasi pengiriman WhatsApp
    const message = `🔔 *Registrasi Mitra Baru*\n\n` +
                   `Nama: ${mitra.business_name}\n` +
                   `Email: ${mitra.email}\n` +
                   `Telepon: ${mitra.phone}\n` +
                   `Lokasi: ${mitra.city}, ${mitra.province}\n\n` +
                   `Silakan cek admin dashboard untuk verifikasi.`

    console.log('📱 WhatsApp notification sent to admin:', {
      to: '+6281234567890', // Nomor admin
      message
    })

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
  }
}

/**
 * Mengirim notifikasi Slack ke channel admin (opsional)
 */
export async function notifyAdminViaSlack(mitra: Mitra): Promise<void> {
  try {
    const slackMessage = {
      text: "Registrasi Mitra Baru",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔔 Registrasi Mitra Baru"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Nama Bisnis:*\n${mitra.business_name}`
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${mitra.email}`
            },
            {
              type: "mrkdwn",
              text: `*Telepon:*\n${mitra.phone}`
            },
            {
              type: "mrkdwn",
              text: `*Lokasi:*\n${mitra.city}, ${mitra.province}`
            }
          ]
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Verifikasi Sekarang"
              },
              url: `https://repareka.com/admin/mitra-verification?id=${mitra.id}`,
              style: "primary"
            }
          ]
        }
      ]
    }

    console.log('💬 Slack notification sent to admin channel:', slackMessage)

  } catch (error) {
    console.error('Error sending Slack notification:', error)
  }
}

/**
 * Fungsi utama untuk mengirim semua jenis notifikasi admin
 */
export async function sendAllAdminNotifications(mitra: Mitra): Promise<void> {
  // Jalankan semua notifikasi secara parallel untuk performa yang lebih baik
  await Promise.allSettled([
    notifyAdminNewMitraRegistration(mitra),
    notifyAdminViaWhatsApp(mitra),
    notifyAdminViaSlack(mitra)
  ])
}
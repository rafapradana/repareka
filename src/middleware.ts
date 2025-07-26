import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware untuk route protection berdasarkan role
 * Mengatur akses ke halaman berdasarkan status authentication dan role user
 */
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Skip middleware jika Supabase belum dikonfigurasi dengan benar
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseAnonKey.includes('placeholder')) {
    console.warn('Supabase not configured properly, skipping middleware authentication')
    return res
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Record<string, unknown>) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const { pathname } = req.nextUrl
  
  // Routes yang memerlukan authentication
  const protectedRoutes = ['/dashboard', '/profile', '/orders', '/chat']
  const mitraRoutes = ['/mitra/dashboard', '/mitra/orders', '/mitra/profile', '/mitra/calendar']
  const customerRoutes = ['/customer/profile', '/customer/orders', '/customer/chat']
  
  // Cek apakah route memerlukan protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isMitraRoute = mitraRoutes.some(route => pathname.startsWith(route))
  const isCustomerRoute = customerRoutes.some(route => pathname.startsWith(route))
  
  // Jika tidak ada session dan mengakses protected route
  if (!session && (isProtectedRoute || isMitraRoute || isCustomerRoute)) {
    // Untuk mitra routes, redirect ke /mitra (halaman auth mitra)
    if (isMitraRoute) {
      return NextResponse.redirect(new URL('/mitra', req.url))
    }
    // Untuk routes lain, redirect ke login umum
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Jika ada session, tentukan role user
  if (session) {
    try {
      // Cek role user dari database
      const userRole = await determineUserRole(supabase, session.user.id)
      
      if (userRole === 'mitra') {
        // Cek status verifikasi mitra
        const mitraData = await getMitraData(supabase, session.user.id)
        
        // Jika mitra belum diverifikasi dan mencoba akses dashboard
        if (mitraData && isMitraRoute && 
            (mitraData.verification_status !== 'approved' || !mitraData.is_active)) {
          return NextResponse.redirect(new URL('/mitra', req.url))
        }
        
        // Jika mitra sudah diverifikasi tapi mengakses halaman auth mitra
        if (mitraData && pathname === '/mitra' && 
            mitraData.verification_status === 'approved' && mitraData.is_active) {
          return NextResponse.redirect(new URL('/mitra/dashboard', req.url))
        }
        
        // Jika mitra mengakses customer routes, redirect ke mitra dashboard
        if (isCustomerRoute || pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
          return NextResponse.redirect(new URL('/mitra/dashboard', req.url))
        }
      }
      
      if (userRole === 'customer') {
        // Customer mencoba akses mitra route, redirect ke homepage
        if (isMitraRoute || pathname.startsWith('/mitra')) {
          return NextResponse.redirect(new URL('/', req.url))
        }
      }
      
    } catch (error) {
      console.error('Error determining user role in middleware:', error)
      // Jika error, redirect ke login
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  return res
}

/**
 * Helper function untuk menentukan role user
 */
async function determineUserRole(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<'customer' | 'mitra' | null> {
  try {
    // Cek di tabel users terlebih dahulu
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (userData && !userError) {
      return 'customer'
    }
    
    // Jika tidak ada di users, cek di tabel mitra
    const { data: mitraData, error: mitraError } = await supabase
      .from('mitra')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (mitraData && !mitraError) {
      return 'mitra'
    }
    
    return null
  } catch (error) {
    console.error('Error determining user role:', error)
    return null
  }
}

/**
 * Helper function untuk mendapatkan data mitra
 */
async function getMitraData(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<{ verification_status: string; is_active: boolean } | null> {
  try {
    const { data: mitraData, error } = await supabase
      .from('mitra')
      .select('verification_status, is_active')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error getting mitra data:', error)
      return null
    }
    
    return mitraData
  } catch (error) {
    console.error('Error getting mitra data:', error)
    return null
  }
}

// Konfigurasi matcher untuk menentukan routes mana yang akan diproses middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
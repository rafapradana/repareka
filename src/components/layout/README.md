# Layout Components

Komponen-komponen layout utama untuk aplikasi Repareka yang menyediakan struktur navigasi dan tampilan yang konsisten.

## Komponen Utama

### MainLayout
Komponen wrapper utama yang menggabungkan header, footer, dan mobile navigation drawer.

**Props:**
- `children: React.ReactNode` - Konten halaman
- `showFilters?: boolean` - Menampilkan filter sidebar (untuk implementasi masa depan)
- `user?: User | null` - Data user yang sedang login

**Fitur:**
- Responsive design dengan mobile-first approach
- Sticky header dengan navigation
- Mobile navigation drawer
- Footer dengan informasi platform

### Header
Komponen header dengan navigation bar, search bar, dan tombol authentication.

**Props:**
- `user?: User | null` - Data user yang sedang login
- `onMobileMenuToggle: () => void` - Callback untuk toggle mobile menu
- `isMobileNavOpen: boolean` - Status mobile navigation drawer

**Fitur:**
- Logo Repareka dengan link ke homepage
- Desktop navigation menu
- Search bar dengan debounced input
- Authentication buttons (login/register atau user dropdown)
- Mobile hamburger menu button

### SearchBar
Komponen search bar dengan debounced input dan real-time search suggestions.

**Props:**
- `onClose?: () => void` - Callback untuk menutup search (mobile)
- `placeholder?: string` - Placeholder text untuk input

**Fitur:**
- Debounced search dengan delay 300ms
- Loading indicator saat searching
- Clear button untuk menghapus query
- Keyboard navigation support
- URL state management untuk search results

### AuthButtons
Komponen tombol authentication yang menampilkan login/register atau user dropdown.

**Props:**
- `user?: User | null` - Data user yang sedang login

**Fitur:**
- Login dan Register buttons untuk guest users
- User dropdown dengan avatar dan menu untuk authenticated users
- Profile, settings, dan logout options
- Responsive design dengan text yang hilang di mobile

### MobileNavDrawer
Komponen navigation drawer untuk mobile devices.

**Props:**
- `isOpen: boolean` - Status drawer (terbuka/tertutup)
- `onClose: () => void` - Callback untuk menutup drawer
- `user?: User | null` - Data user yang sedang login

**Fitur:**
- Slide-in animation dari kiri
- Backdrop overlay dengan click-to-close
- User info section untuk authenticated users
- Navigation menu dengan icons
- Authentication buttons untuk guest users
- Keyboard navigation (ESC to close)

### Footer
Komponen footer dengan links, informasi kontak, dan social media.

**Fitur:**
- Responsive grid layout
- Brand section dengan logo dan deskripsi
- Organized link sections (Layanan, Perusahaan, Mitra, Bantuan)
- Contact information
- Social media links
- Copyright dan language selector

## User Type Interface

```typescript
interface User {
  id: string
  email: string
  full_name?: string
  business_name?: string
  avatar_url?: string
}
```

## Penggunaan

```tsx
import { MainLayout } from '@/components/layout'

export default function MyPage() {
  return (
    <MainLayout user={currentUser}>
      <div className="container mx-auto px-4 py-8">
        {/* Konten halaman */}
      </div>
    </MainLayout>
  )
}
```

## Dependencies

- `lucide-react` - Icons
- `use-debounce` - Debounced search functionality
- `next/link` - Navigation
- `next/image` - Optimized images
- `next/navigation` - Router hooks

## Styling

Menggunakan Tailwind CSS dengan custom color variables yang didefinisikan di `globals.css`:
- Primary colors (hijau)
- Secondary colors (biru-hijau)
- Base colors (abu-abu)
- Support untuk dark/light theme

## Accessibility

- Semantic HTML structure
- Proper ARIA labels dan roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management untuk mobile drawer
- Color contrast compliance

## Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly UI elements (minimum 44px touch targets)
- Responsive navigation dengan hamburger menu
- Optimized search experience untuk mobile
- Swipe gestures support (future enhancement)

## Performance

- Lazy loading untuk images
- Debounced search untuk mengurangi API calls
- Optimized bundle size dengan tree shaking
- Efficient re-renders dengan proper memoization
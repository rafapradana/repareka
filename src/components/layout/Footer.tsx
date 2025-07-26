'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Layanan',
      links: [
        { label: 'Reparasi Pakaian', href: '/categories/pakaian' },
        { label: 'Reparasi Sepatu', href: '/categories/sepatu' },
        { label: 'Reparasi Elektronik', href: '/categories/elektronik' },
        { label: 'Reparasi Furniture', href: '/categories/furniture' },
        { label: 'Semua Kategori', href: '/categories' },
      ]
    },
    {
      title: 'Perusahaan',
      links: [
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Karir', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press Kit', href: '/press' },
        { label: 'Kontak', href: '/contact' },
      ]
    },
    {
      title: 'Mitra',
      links: [
        { label: 'Daftar Sebagai Mitra', href: '/mitra/register' },
        { label: 'Dashboard Mitra', href: '/mitra/dashboard' },
        { label: 'Panduan Mitra', href: '/mitra/guide' },
        { label: 'Syarat & Ketentuan Mitra', href: '/mitra/terms' },
      ]
    },
    {
      title: 'Bantuan',
      links: [
        { label: 'Pusat Bantuan', href: '/help' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Kebijakan Privasi', href: '/privacy' },
        { label: 'Syarat & Ketentuan', href: '/terms' },
        { label: 'Lapor Masalah', href: '/report' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/repareka', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/repareka', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/repareka', label: 'Twitter' },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">R</span>
                </div>
                <span className="font-display font-semibold text-xl text-foreground">
                  Repareka
                </span>
              </Link>
              
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Platform terpercaya untuk menemukan layanan reparasi berkualitas di seluruh Indonesia. 
                Perbaiki, jangan buang!
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>hello@repareka.com</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-foreground mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} Repareka. Semua hak dilindungi.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Ikuti kami:</span>
              <div className="flex space-x-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md hover:bg-accent transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Language/Region Selector - TODO: Implement */}
            <div className="text-sm text-muted-foreground">
              🇮🇩 Indonesia
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
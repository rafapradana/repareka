"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User as UserIcon,
  LogIn,
  LogOut,
  Settings,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { User } from "./types";
import type { Mitra } from "@/lib/auth/types";

interface AuthButtonsProps {
  user?: User | null;
}

export function AuthButtons({ user: propUser }: AuthButtonsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use auth context user if available, fallback to prop user
  const currentUser = user?.profile || propUser;
  
  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      closeDropdown();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Jika user sudah login
  if (currentUser) {
    const isMitra = user?.role === 'mitra';
    const mitraData = isMitra ? (user.profile as Mitra) : null;
    
    // Status verification untuk mitra
    const getVerificationStatus = () => {
      if (!mitraData) return null;
      
      switch (mitraData.verification_status) {
        case 'pending':
          return { icon: Clock, text: 'Menunggu Verifikasi', color: 'text-yellow-600' };
        case 'approved':
          return { icon: CheckCircle, text: 'Terverifikasi', color: 'text-green-600' };
        case 'rejected':
          return { icon: XCircle, text: 'Ditolak', color: 'text-red-600' };
        default:
          return null;
      }
    };

    const verificationStatus = getVerificationStatus();

    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            {'avatar_url' in currentUser && currentUser.avatar_url ? (
              <Image
                src={currentUser.avatar_url}
                alt={('full_name' in currentUser ? currentUser.full_name : currentUser.business_name) || "User avatar"}
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            ) : isMitra ? (
              <Building2 className="h-4 w-4 text-primary-foreground" />
            ) : (
              <UserIcon className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-foreground">
              {'full_name' in currentUser ? currentUser.full_name : currentUser.business_name}
            </div>
            {verificationStatus && (
              <div className={`flex items-center space-x-1 text-xs ${verificationStatus.color}`}>
                <verificationStatus.icon className="h-3 w-3" />
                <span>{verificationStatus.text}</span>
              </div>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={closeDropdown} />

            {/* Dropdown Content */}
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {'full_name' in currentUser ? currentUser.full_name : currentUser.business_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  {verificationStatus && (
                    <div className={`flex items-center space-x-1 text-xs mt-1 ${verificationStatus.color}`}>
                      <verificationStatus.icon className="h-3 w-3" />
                      <span>{verificationStatus.text}</span>
                    </div>
                  )}
                </div>

                {/* Dashboard Link */}
                {isMitra ? (
                  <Link
                    href="/mitra/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    onClick={closeDropdown}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Dashboard Mitra</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    onClick={closeDropdown}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                <Link
                  href={isMitra ? "/mitra/profile" : "/profile"}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  onClick={closeDropdown}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profil</span>
                </Link>

                <Link
                  href={isMitra ? "/mitra/settings" : "/settings"}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  onClick={closeDropdown}
                >
                  <Settings className="h-4 w-4" />
                  <span>Pengaturan</span>
                </Link>

                <div className="border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Jika user belum login
  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/mitra"
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:block">Jadi Mitra</span>
      </Link>

      <Link
        href="/login"
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:block">Masuk</span>
      </Link>

      <Link
        href="/register"
        className="flex items-center space-x-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        <UserIcon className="h-4 w-4" />
        <span>Daftar</span>
      </Link>
    </div>
  );
}
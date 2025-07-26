"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { AuthButtons } from "./AuthButtons";
import type { User } from "./types";

interface HeaderProps {
  user?: User | null;
  onMobileMenuToggle: () => void;
  isMobileNavOpen: boolean;
}

export function Header({
  user,
  onMobileMenuToggle,
  isMobileNavOpen,
}: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo dan Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileNavOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  R
                </span>
              </div>
              <span className="font-display font-semibold text-xl text-foreground hidden sm:block">
                Repareka
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/categories"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Kategori
            </Link>
            <Link
              href="/mitra"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Jadi Mitra
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Tentang
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Auth Buttons */}
            <AuthButtons user={user} />
          </div>
        </div>

        {/* Mobile Search Bar - Expanded */}
        {isSearchExpanded && (
          <div className="md:hidden pb-4">
            <SearchBar onClose={() => setIsSearchExpanded(false)} />
          </div>
        )}
      </div>
    </header>
  );
}

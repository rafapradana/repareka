"use client";

import React, { useState } from "react";
import { Header, Footer, MobileNavDrawer } from "./index";
import { MobileOptimizedApp } from "@/components/mobile/MobileOptimizedApp";
import type { User } from "./types";

interface MainLayoutProps {
  children: React.ReactNode;
  showFilters?: boolean;
  user?: User | null;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <MobileOptimizedApp>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header dengan navigation */}
        <Header
          user={user}
          onMobileMenuToggle={toggleMobileNav}
          isMobileNavOpen={isMobileNavOpen}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          isOpen={isMobileNavOpen}
          onClose={closeMobileNav}
          user={user}
        />

        {/* Main Content */}
        <main className="flex-1 safe-area-top safe-area-bottom">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </MobileOptimizedApp>
  );
}

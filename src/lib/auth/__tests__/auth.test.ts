/**
 * Test file untuk memverifikasi bahwa semua auth utilities dapat di-import
 * dan memiliki struktur yang benar
 */

// Test imports
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import { describe } from "node:test";
import {
  // Types
  User,
  Mitra,
  UserRole,
  AuthUser,

  // Utils
  getCurrentSession,
  getUserProfile,
  determineUserRole,
  loginUser,
  registerCustomer,
  registerMitra,
  logoutUser,
  refreshSession,
  isAuthenticated,
  getCurrentUser,

  // Session
  storeUserSession,
  getUserSession,
  clearUserSession,
  isSessionValid,
  refreshSessionActivity,
  getSessionRole,
  setupSessionMonitoring,
  handleSessionExpiration,

  // Hooks
  useAuth,
  useUser,
  useMitra,

  // Context
  AuthProvider,
  useAuthContext,

  // Components
  AuthGuard,
  withAuthGuard,
  CustomerGuard,
  MitraGuard,
} from "../index";

describe("Auth System Exports", () => {
  test("should export all required types", () => {
    // Verifikasi bahwa types dapat digunakan
    const userRole: UserRole = "customer";
    expect(userRole).toBe("customer");
  });

  test("should export all utility functions", () => {
    // Verifikasi bahwa functions ada dan dapat dipanggil
    expect(typeof getCurrentSession).toBe("function");
    expect(typeof getUserProfile).toBe("function");
    expect(typeof determineUserRole).toBe("function");
    expect(typeof loginUser).toBe("function");
    expect(typeof registerCustomer).toBe("function");
    expect(typeof registerMitra).toBe("function");
    expect(typeof logoutUser).toBe("function");
    expect(typeof refreshSession).toBe("function");
    expect(typeof isAuthenticated).toBe("function");
    expect(typeof getCurrentUser).toBe("function");
  });

  test("should export all session management functions", () => {
    expect(typeof storeUserSession).toBe("function");
    expect(typeof getUserSession).toBe("function");
    expect(typeof clearUserSession).toBe("function");
    expect(typeof isSessionValid).toBe("function");
    expect(typeof refreshSessionActivity).toBe("function");
    expect(typeof getSessionRole).toBe("function");
    expect(typeof setupSessionMonitoring).toBe("function");
    expect(typeof handleSessionExpiration).toBe("function");
  });

  test("should export all hooks", () => {
    expect(typeof useAuth).toBe("function");
    expect(typeof useUser).toBe("function");
    expect(typeof useMitra).toBe("function");
  });

  test("should export context provider and hook", () => {
    expect(typeof AuthProvider).toBe("function");
    expect(typeof useAuthContext).toBe("function");
  });

  test("should export auth guard components", () => {
    expect(typeof AuthGuard).toBe("function");
    expect(typeof withAuthGuard).toBe("function");
    expect(typeof CustomerGuard).toBe("function");
    expect(typeof MitraGuard).toBe("function");
  });
});

// Mock data untuk testing
export const mockUser: User = {
  id: "123",
  email: "customer@example.com",
  full_name: "John Doe",
  phone: "08123456789",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockMitra: Mitra = {
  id: "456",
  email: "mitra@example.com",
  business_name: "Toko Reparasi ABC",
  phone: "08123456789",
  address: "Jl. Contoh No. 123",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  business_type: "small_business",
  verification_status: "approved",
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockAuthUser: AuthUser = {
  id: "123",
  email: "customer@example.com",
  role: "customer",
  profile: mockUser,
};

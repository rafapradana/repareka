# Testing Documentation

Dokumentasi lengkap untuk testing suite pada aplikasi Repareka Homepage Auth System.

## Overview

Testing suite ini mencakup:

- **Unit Tests** - Testing untuk hooks, utilities, dan komponen individual
- **Component Tests** - Testing untuk UI components dengan React Testing Library
- **Integration Tests** - Testing untuk authentication flows dan API integration
- **E2E Tests** - End-to-end testing dengan Playwright
- **Accessibility Tests** - Testing aksesibilitas dengan axe-core
- **Performance Tests** - Testing performa dan monitoring

## Struktur Testing

```
src/test/
├── components/          # Component tests
│   ├── ServiceCard.test.tsx
│   └── SearchAndFilter.test.tsx
├── hooks/              # Hook tests
│   ├── useAuth.test.tsx
│   └── useServices.test.tsx
├── integration/        # Integration tests
│   └── auth-flow.test.tsx
├── e2e/               # End-to-end tests
│   ├── homepage.spec.ts
│   └── auth-flow.spec.ts
├── accessibility/     # Accessibility tests
│   └── axe.test.tsx
├── performance/       # Performance tests
│   └── performance.test.ts
├── mocks.ts          # Mock utilities
├── setup.ts          # Test setup
└── utils.tsx         # Test utilities
```

## Menjalankan Tests

### Unit & Component Tests

```bash
# Jalankan semua unit tests
npm run test

# Watch mode untuk development
npm run test:watch

# Dengan coverage report
npm run test:coverage

# UI mode untuk debugging
npm run test:ui
```

### Integration Tests

```bash
# Jalankan integration tests
npm run test:integration
```

### E2E Tests

```bash
# Jalankan E2E tests
npm run test:e2e

# Dengan UI mode
npm run test:e2e:ui

# Dengan browser visible
npm run test:e2e:headed
```

### Accessibility Tests

```bash
# Jalankan accessibility tests
npm run test:accessibility
```

### Performance Tests

```bash
# Jalankan performance tests
npm run test:performance
```

### Semua Tests

```bash
# Jalankan semua tests
npm run test:all

# Untuk CI/CD
npm run test:ci
```

## Testing Guidelines

### Unit Tests

#### Hooks Testing

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

test("should return initial state", () => {
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

  expect(result.current.loading).toBe(true);
  expect(result.current.user).toBe(null);
});
```

#### Component Testing

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceCard } from "@/components/services/ServiceCard";

test("should render service information", () => {
  render(<ServiceCard service={mockService} />);

  expect(screen.getByText(mockService.title)).toBeInTheDocument();
  expect(screen.getByText("Pesan Sekarang")).toBeInTheDocument();
});
```

### Integration Tests

Testing untuk flows yang melibatkan multiple components:

```typescript
test("should complete customer registration flow", async () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <CustomerAuthForm mode="register" onSuccess={mockOnSuccess} />
    </AuthProvider>
  );

  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.click(screen.getByRole("button", { name: /daftar/i }));

  await waitFor(() => {
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
```

### E2E Tests

Testing untuk user journeys lengkap:

```typescript
test("should complete homepage search flow", async ({ page }) => {
  await page.goto("/");

  const searchInput = page.getByPlaceholder("Cari layanan reparasi");
  await searchInput.fill("sepatu");

  await expect(page.getByText('Hasil pencarian "sepatu"')).toBeVisible();
});
```

### Accessibility Tests

Testing dengan axe-core:

```typescript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("should not have accessibility violations", async () => {
  const { container } = render(<ServiceCard service={mockService} />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Mocking Guidelines

### API Mocking

```typescript
// Mock Supabase client
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  },
}));
```

### Component Mocking

```typescript
// Mock Next.js Image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));
```

### Hook Mocking

```typescript
// Mock custom hooks
vi.mock("@/hooks/useServices", () => ({
  useServices: () => ({
    services: mockServices,
    loading: false,
    error: null,
  }),
}));
```

## Coverage Requirements

Target coverage minimum:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Coverage Exclusions

- Test files
- Configuration files
- Type definitions
- Stories files
- Node modules

## Performance Testing

### Core Web Vitals Monitoring

```typescript
test("should monitor LCP performance", () => {
  const mockLCPEntries = [{ startTime: 1500 }];
  // Test LCP monitoring logic
});
```

### Component Performance

```typescript
test("should measure component render time", () => {
  const result = measureComponentRender("ServiceCard", () => {
    return render(<ServiceCard service={mockService} />);
  });
  // Verify performance metrics
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:accessibility
    npm run test:performance
```

### Coverage Reports

Coverage reports tersedia dalam format:

- **Text** - Console output
- **HTML** - Browser-friendly report
- **JSON** - Machine-readable format

## Debugging Tests

### Debug Mode

```bash
# Debug dengan UI
npm run test:ui

# Debug E2E tests
npm run test:e2e:ui
```

### Console Logging

```typescript
test("debug test", () => {
  const { debug } = render(<Component />);
  debug(); // Prints DOM structure
});
```

### Playwright Debugging

```typescript
test("debug E2E", async ({ page }) => {
  await page.pause(); // Pauses execution for debugging
});
```

## Best Practices

### Test Organization

- Gunakan `describe` blocks untuk grouping
- Nama test yang descriptive
- Setup dan cleanup yang proper

### Test Data

- Gunakan mock data yang realistic
- Isolate test data per test
- Clean up setelah test

### Assertions

- Specific assertions
- Test behavior, bukan implementation
- Use appropriate matchers

### Performance

- Avoid unnecessary re-renders
- Mock heavy dependencies
- Use appropriate timeouts

## Troubleshooting

### Common Issues

#### Tests Timeout

```typescript
// Increase timeout untuk slow operations
await waitFor(
  () => {
    expect(element).toBeInTheDocument();
  },
  { timeout: 5000 }
);
```

#### Mock Issues

```typescript
// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

#### Async Issues

```typescript
// Proper async handling
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

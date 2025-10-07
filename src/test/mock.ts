import type { Control, UseFormSetValue } from "react-hook-form";
import { vi } from "vitest";

export const createMocks = () => ({
  mockSetValue: vi.fn() as UseFormSetValue<Record<string, unknown>>,
  mockControl: {} as Control<Record<string, unknown>>,
  mockStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    clear: vi.fn(),
    key: vi.fn(),
  },
});

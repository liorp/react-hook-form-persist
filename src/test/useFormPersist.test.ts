import { act, renderHook } from "@testing-library/react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFormPersist } from "../useFormPersist";

vi.mock("react-hook-form", () => ({
  useWatch: vi.fn(),
}));

describe("useFormPersist", () => {
  const mockSetValue = vi.fn() as UseFormSetValue<Record<string, unknown>>;
  const mockControl = {} as Control<Record<string, unknown>>;
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    clear: vi.fn(),
    key: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({});
  });

  it("should restore data from storage on mount", () => {
    const mockData = { name: "John", email: "john@example.com" };
    mockStorage.getItem.mockReturnValue(JSON.stringify(mockData));

    renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
      })
    );

    expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
    expect(mockStorage.getItem).toHaveBeenCalledWith("test-form-v1");
    expect(mockSetValue).toHaveBeenCalledTimes(2);
    expect(mockSetValue).toHaveBeenCalledWith("name", "John", {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
    expect(mockSetValue).toHaveBeenCalledWith("email", "john@example.com", {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  });

  it("should exclude specified fields from restoration", () => {
    const mockData = {
      name: "John",
      email: "john@example.com",
      password: "secret",
    };
    mockStorage.getItem.mockReturnValue(JSON.stringify(mockData));

    renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
        exclude: ["password"],
      })
    );

    expect(mockSetValue).toHaveBeenCalledTimes(2);
    expect(mockSetValue).toHaveBeenCalledWith(
      "name",
      "John",
      expect.any(Object)
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      "email",
      "john@example.com",
      expect.any(Object)
    );
    expect(mockSetValue).not.toHaveBeenCalledWith(
      "password",
      "secret",
      expect.any(Object)
    );
  });

  it("should handle timeout expiration", () => {
    const mockData = { _timestamp: Date.now() - 2000, name: "John" };
    mockStorage.getItem.mockReturnValue(JSON.stringify(mockData));
    const onTimeout = vi.fn();

    renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
        timeout: 1000,
        onTimeout,
      })
    );

    expect(onTimeout).toHaveBeenCalled();
    expect(mockStorage.removeItem).toHaveBeenCalledWith("test-form-v1");
  });

  it("should save data to storage when watched values change", () => {
    const mockWatchedValues = { name: "John", email: "john@example.com" };
    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockWatchedValues
    );

    renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
      })
    );

    expect(mockStorage.setItem).toHaveBeenCalledTimes(1);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      "test-form-v1",
      JSON.stringify(mockWatchedValues)
    );
  });

  it("should clear storage when clear function is called", () => {
    const { result } = renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
      })
    );

    act(() => {
      result.current.clear();
    });

    expect(mockStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(mockStorage.removeItem).toHaveBeenCalledWith("test-form-v1");
  });

  it("should use localStorage as default storage", () => {
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      clear: vi.fn(),
      key: vi.fn(),
    };

    const originalLocalStorage = window.localStorage;
    window.localStorage = mockLocalStorage;

    renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
      })
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-form-v1");

    window.localStorage = originalLocalStorage;
  });

  it("should call onDataRestored callback when data is restored", () => {
    const mockData = { name: "John", email: "john@example.com" };
    mockStorage.getItem.mockReturnValue(JSON.stringify(mockData));
    const onDataRestored = vi.fn();

    renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
        onDataRestored,
      })
    );

    expect(onDataRestored).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
    });
  });

  it("should debounce storage writes when debounceDelay is provided", async () => {
    vi.useFakeTimers();

    const initialValues = { name: "" };
    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      initialValues
    );

    const { rerender } = renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
        debounceDelay: 500,
      })
    );

    mockStorage.setItem.mockClear();

    const newValues = { name: "John" };
    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      newValues
    );

    rerender();

    expect(mockStorage.setItem).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      "test-form-v1",
      JSON.stringify(newValues)
    );

    vi.useRealTimers();
  });

  it("should cancel previous debounced saves when new changes occur", async () => {
    vi.useFakeTimers();

    const initialValues = { name: "John" };
    const updatedValues = { name: "Jane" };

    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      initialValues
    );

    const { rerender } = renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
        debounceDelay: 500,
      })
    );

    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      updatedValues
    );

    rerender();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockStorage.setItem).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockStorage.setItem).toHaveBeenCalledTimes(1);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      "test-form-v1",
      JSON.stringify(updatedValues)
    );

    vi.useRealTimers();
  });

  it("should save immediately when debounceDelay is 0", () => {
    const initialValues = { name: "" };
    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      initialValues
    );

    const { rerender } = renderHook(() =>
      useFormPersist("test-form-v1", {
        control: mockControl,
        setValue: mockSetValue,
        storage: mockStorage,
        debounceDelay: 0,
      })
    );

    mockStorage.setItem.mockClear();

    const newValues = { name: "John" };
    (useWatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      newValues
    );

    rerender();

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      "test-form-v1",
      JSON.stringify(newValues)
    );
  });
});

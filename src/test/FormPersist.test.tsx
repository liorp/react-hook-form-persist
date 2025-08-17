import { render } from "@testing-library/react";
import type { UseFormReturn } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormPersist } from "../FormPersist";
import * as useFormPersistModule from "../useFormPersist";

// Mock useFormPersist
vi.mock("../useFormPersist", () => ({
  useFormPersist: vi.fn(),
}));

describe("FormPersist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render null", () => {
    const mockForm = {
      control: {},
      setValue: vi.fn(),
    } as unknown as UseFormReturn<Record<string, unknown>>;

    const { container } = render(
      <FormPersist form={mockForm} formKey="test-form" />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should call useFormPersist with correct parameters", () => {
    const mockForm = {
      control: {},
      setValue: vi.fn(),
    } as unknown as UseFormReturn<Record<string, unknown>>;

    render(<FormPersist form={mockForm} formKey="test-form" />);

    expect(useFormPersistModule.useFormPersist).toHaveBeenCalledWith(
      "test-form",
      {
        control: mockForm.control,
        setValue: mockForm.setValue,
      }
    );
  });
});

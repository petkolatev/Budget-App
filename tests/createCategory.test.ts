import { renderHook, act } from "@testing-library/react";
import { useCreateCategory } from "../app/hooks/useCreateCategory";

describe("useCreateCategory", () => {
  const mockReload = jest.fn();
  const mockToast = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("Created category successfully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, message: "Category created" }),
    });

    const { result } = renderHook(() =>
      useCreateCategory(mockReload, mockToast, mockClose),
    );

    await act(() =>
      result.current.createCategory(
        { preventDefault: jest.fn() } as any,
        "Test",
        jest.fn(),
      ),
    );

    expect(mockToast).toHaveBeenCalledWith("Category created", "success");
    expect(mockReload).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it("shows error on empty name", async () => {
    const { result } = renderHook(() =>
      useCreateCategory(mockReload, mockToast, mockClose),
    );

    await act(() =>
      result.current.createCategory(
        { preventDefault: jest.fn() } as any,
        "",
        jest.fn(),
      ),
    );

    expect(mockToast).toHaveBeenCalledWith("Category is required", "error");
  });
});

import { renderHook, act } from "@testing-library/react";
import { useDeleteCategory } from "../app/hooks/useDeleteCategory";

describe("useDeleteCategory", () => {
  const mockReload = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("Delete category successfully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Deleted successfully" }),
    });

    const { result } = renderHook(() =>
      useDeleteCategory(mockReload, mockToast),
    );

    await act(() => result.current.deleteCategory("123"));

    expect(mockToast).toHaveBeenCalledWith("Deleted successfully", "success");
    expect(mockReload).toHaveBeenCalled();
  });

  it("shows error on failed response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Delete failed" }),
    });

    const { result } = renderHook(() =>
      useDeleteCategory(mockReload, mockToast),
    );

    await act(() => result.current.deleteCategory("123"));

    expect(mockToast).toHaveBeenCalledWith("Error: Delete failed", "error");
  });
});

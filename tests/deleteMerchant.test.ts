import { renderHook, act } from "@testing-library/react";
import { useDeleteMerchant } from "../app/hooks/useDeleteMerchant";

describe("useDeleteMerchant", () => {
  const mockReloadCategories = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delete successfully merchant", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Merchant deleted" }),
    });

    const { result } = renderHook(() =>
      useDeleteMerchant(mockReloadCategories, mockShowToast),
    );

    await act(() => result.current.deleteMerchant("123", "Test Merchant"));

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/merchant/123",
      expect.any(Object),
    );
    expect(mockShowToast).toHaveBeenCalledWith("Merchant deleted", "success");
    expect(mockReloadCategories).toHaveBeenCalled();
  });

  it("shows error on failed response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Not found" }),
    });

    const { result } = renderHook(() =>
      useDeleteMerchant(mockReloadCategories, mockShowToast),
    );

    await act(() => result.current.deleteMerchant("123", "Test Merchant"));

    expect(mockShowToast).toHaveBeenCalledWith("Error: Not found", "error");
  });

  it("shows network error error", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce("Network error");

    const { result } = renderHook(() =>
      useDeleteMerchant(mockReloadCategories, mockShowToast),
    );

    await act(() => result.current.deleteMerchant("123", "Test Merchant"));

    expect(mockShowToast).toHaveBeenCalledWith("Error: Network error", "error");
  });
});

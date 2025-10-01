import { renderHook, act } from "@testing-library/react";
import { useDeleteMerchant } from "../app/hooks/useDeleteMerchant";

describe("useDeleteMerchant", () => {
    const mockReloadCategories = jest.fn();
    const mockShowToast = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("успешно изтрива търговец", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: "Merchant deleted" }),
        });

        const { result } = renderHook(() =>
            useDeleteMerchant(mockReloadCategories, mockShowToast)
        );

        await act(() =>
            result.current.deleteMerchant("123", "Test Merchant")
        );

        expect(global.fetch).toHaveBeenCalledWith("/api/merchant/123", expect.any(Object));
        expect(mockShowToast).toHaveBeenCalledWith("Merchant deleted", "success");
        expect(mockReloadCategories).toHaveBeenCalled();
    });

    it("показва грешка при неуспешен отговор", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Not found" }),
        });

        const { result } = renderHook(() =>
            useDeleteMerchant(mockReloadCategories, mockShowToast)
        );

        await act(() =>
            result.current.deleteMerchant("123", "Test Merchant")
        );

        expect(mockShowToast).toHaveBeenCalledWith("Error: Not found", "error");
    });

    it("показва грешка при мрежова грешка", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce("Network error");

        const { result } = renderHook(() =>
            useDeleteMerchant(mockReloadCategories, mockShowToast)
        );

        await act(() =>
            result.current.deleteMerchant("123", "Test Merchant")
        );

        expect(mockShowToast).toHaveBeenCalledWith("Error: Network error", "error");
    });
});

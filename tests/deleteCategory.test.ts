import { renderHook, act } from "@testing-library/react";
import { useDeleteCategory } from "../app/hooks/useDeleteCategory";

describe("useDeleteCategory", () => {
    const mockReload = jest.fn();
    const mockToast = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it("успешно изтрива категория", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "Изтрита успешно" }),
        });

        const { result } = renderHook(() =>
            useDeleteCategory(mockReload, mockToast)
        );

        await act(() => result.current.deleteCategory("123"));

        expect(mockToast).toHaveBeenCalledWith("Изтрита успешно", "success");
        expect(mockReload).toHaveBeenCalled();
    });

    it("показва грешка при неуспешен отговор", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Неуспешно изтриване" }),
        });

        const { result } = renderHook(() =>
            useDeleteCategory(mockReload, mockToast)
        );

        await act(() => result.current.deleteCategory("123"));

        expect(mockToast).toHaveBeenCalledWith("Error: Неуспешно изтриване", "error");
    });
});

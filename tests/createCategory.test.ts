import { renderHook, act } from "@testing-library/react";
import { useCreateCategory } from "../app/hooks/useCreateCategory";

describe("useCreateCategory", () => {
  const mockReload = jest.fn();
  const mockToast = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("създава категория успешно", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, message: "Категорията е създадена" }),
    });

    const { result } = renderHook(() =>
      useCreateCategory(mockReload, mockToast, mockClose)
    );

    await act(() =>
      result.current.createCategory(
        { preventDefault: jest.fn() } as any,
        "Test",
        jest.fn()
      )
    );

    expect(mockToast).toHaveBeenCalledWith("Категорията е създадена", "success");
    expect(mockReload).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it("показва грешка при празно име", async () => {
    const { result } = renderHook(() =>
      useCreateCategory(mockReload, mockToast, mockClose)
    );

    await act(() =>
      result.current.createCategory(
        { preventDefault: jest.fn() } as any,
        "",
        jest.fn()
      )
    );

    expect(mockToast).toHaveBeenCalledWith("Category is required", "error");
  });
});

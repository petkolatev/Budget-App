import { renderHook, act } from '@testing-library/react'
import { useCreateMerchant } from '../app/hooks/useCreateMerchant';

describe("useCreateMerchant", () => {
  const mockReloadCategories = jest.fn();
  const mockShowToast = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully create merchant ", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, message: "created merchant" }),
    });

    const { result } = renderHook(() =>
      useCreateMerchant(mockReloadCategories, mockShowToast, mockCloseModal)
    );
    await act(() =>
      result.current.createMerchant(
        { preventDefault: jest.fn() } as any,
        "Категория",
        "Търговец",
        "Описание",
        () => { }
      )
    );
    expect(mockShowToast).toHaveBeenCalledWith("created merchant", "success");
    expect(mockReloadCategories).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();

  });

  it("show error on failed response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: false, error: "Invalid data" }),
    });

    const { result } = renderHook(() =>
      useCreateMerchant(mockReloadCategories, mockShowToast, mockCloseModal)
    );

    await act(() =>
      result.current.createMerchant(
        { preventDefault: jest.fn() } as any,
        "Категория",
        "Търговец",
        "Описание",
        () => { }
      )
    );

    expect(mockShowToast).toHaveBeenCalledWith("Error: Invalid data", "error");
  });

  it("shows error on exception", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() =>
      useCreateMerchant(mockReloadCategories, mockShowToast, mockCloseModal)
    );

    await act(() =>
      result.current.createMerchant(
        { preventDefault: jest.fn() } as any,
        "",
        "",
        "description",
        () => { }
      )
    );

    expect(mockShowToast).toHaveBeenCalledWith(
      "Category and Merchant are required",
      "error"
    );
  });
});

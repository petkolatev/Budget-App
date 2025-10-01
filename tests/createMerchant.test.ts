import { FormEvent } from "react";
import { handleCreateMerchant } from "../app/utils/CreateMerchant";

describe("handleCreateMerchant", () => {
  const setLoading = jest.fn();
  const setName = jest.fn();
  const setMerchantName = jest.fn();
  const setDescription = jest.fn();
  const reloadCategories = jest.fn();
  const showMerchantModal = jest.fn();
  const showToast = jest.fn();

  const fakeEvent = { preventDefault: jest.fn() } as unknown as FormEvent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully create merchant ", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, message: "created merchant" }),
    });

    await handleCreateMerchant(
      fakeEvent,
      "Test Category",
      "Test Merchant",
      "Test Description",
      setLoading,
      setName,
      setMerchantName,
      setDescription,
      reloadCategories,
      showMerchantModal,
      showToast,
    );
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/merchant",
      expect.any(Object),
    );
    expect(showToast).toHaveBeenCalledWith("created merchant", "success");
    expect(setName).toHaveBeenCalledWith("");
    expect(setMerchantName).toHaveBeenCalledWith("");
    expect(setDescription).toHaveBeenCalledWith("");
    expect(reloadCategories).toHaveBeenCalled();
    expect(showMerchantModal).toHaveBeenCalledWith(false);
    expect(reloadCategories).toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("show error on failed response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: false, error: "Invalid data" }),
    });

    await handleCreateMerchant(
      fakeEvent,
      "Test Category",
      "Test Merchant",
      "Test Description",
      setLoading,
      setName,
      setMerchantName,
      setDescription,
      reloadCategories,
      showMerchantModal,
      showToast,
    );

    expect(showToast).toHaveBeenCalledWith("Error: Invalid data", "error");
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("shows error on exception", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    await handleCreateMerchant(
      fakeEvent,
      "Test Category",
      "Test Merchant",
      "Test Description",
      setLoading,
      setName,
      setMerchantName,
      setDescription,
      reloadCategories,
      showMerchantModal,
      showToast,
    );

    expect(showToast).toHaveBeenCalledWith(
      "Error: Error: Network error",
      "error",
    );
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});

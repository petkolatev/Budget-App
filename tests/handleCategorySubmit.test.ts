import { FormEvent } from "react";
import { handleCategorySubmit } from "../app/utils/handleCategorySubmit";

describe("handleCategorySubmit", () => {
  const setLoading = jest.fn();
  const setName = jest.fn();
  const reloadCategories = jest.fn();
  const setShowCategoryModal = jest.fn();
  const showToast = jest.fn();

  const fakeEvent = { preventDefault: jest.fn() } as unknown as FormEvent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully created category", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, message: "created category" }),
    });

    await handleCategorySubmit(
      fakeEvent,
      "Test Category",
      setLoading,
      setName,
      reloadCategories,
      setShowCategoryModal,
      showToast,
    );

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/category",
      expect.any(Object),
    );
    expect(showToast).toHaveBeenCalledWith("created category", "success");
    expect(setName).toHaveBeenCalledWith("");
    expect(reloadCategories).toHaveBeenCalled();
    expect(setShowCategoryModal).toHaveBeenCalledWith(false);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("shows error on failed response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: false, error: "Invalid name" }),
    });

    await handleCategorySubmit(
      fakeEvent,
      "Test Category",
      setLoading,
      setName,
      reloadCategories,
      setShowCategoryModal,
      showToast,
    );

    expect(showToast).toHaveBeenCalledWith("Error: Invalid name", "error");
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("shows error on exception", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    await handleCategorySubmit(
      fakeEvent,
      "Test Category",
      setLoading,
      setName,
      reloadCategories,
      setShowCategoryModal,
      showToast,
    );

    expect(showToast).toHaveBeenCalledWith(
      "Error: Error: Network error",
      "error",
    );
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});

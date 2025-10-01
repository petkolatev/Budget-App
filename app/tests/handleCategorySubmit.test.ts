// utils/handleCategorySubmit.test.ts
import { FormEvent } from "react";
import { handleCategorySubmit } from "../utils/handleCategorySubmit";

describe("handleCategorySubmit", () => {
  const setLoading = jest.fn();
  const setName = jest.fn();
  const reloadCategories = jest.fn();
  const setShowCategoryModal = jest.fn();
  const showToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("успешно създава категория", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, message: "Категорията е създадена" }),
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as FormEvent;

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
    expect(showToast).toHaveBeenCalledWith(
      "Категорията е създадена",
      "success",
    );
    expect(setName).toHaveBeenCalledWith("");
    expect(reloadCategories).toHaveBeenCalled();
    expect(setShowCategoryModal).toHaveBeenCalledWith(false);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("показва грешка при неуспешен отговор", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: false, error: "Невалидно име" }),
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as FormEvent;

    await handleCategorySubmit(
      fakeEvent,
      "Test Category",
      setLoading,
      setName,
      reloadCategories,
      setShowCategoryModal,
      showToast,
    );

    expect(showToast).toHaveBeenCalledWith("Error: Невалидно име", "error");
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("показва грешка при exception", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    const fakeEvent = { preventDefault: jest.fn() } as unknown as FormEvent;

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

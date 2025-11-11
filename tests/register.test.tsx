import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpPage from "../app/register/page";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock("../app/dashboard/Preloader", () => {
  const PreloaderMock = () => <div data-testid="preloader">Loading...</div>;
  PreloaderMock.displayName = "PreloaderMock";
  return PreloaderMock;
});

describe("SignUpPage", () => {
  const pushMock = jest.fn();
  const showToastMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useToast as jest.Mock).mockReturnValue({ showToast: showToastMock });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response),
    );

    jest.clearAllMocks();
  });

  it("renders register form", () => {
    render(<SignUpPage />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repeat Password")).toBeInTheDocument();
  });

  it("calls signUp with email,name,password and rePass", async () => {
    render(<SignUpPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Petko" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat Password"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Petko",
            email: "test@example.com",
            password: "123456",
            rePassword: "123456",
          }),
        }),
      );
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error toast on failed register", async () => {
    render(<SignUpPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Petko" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat Password"), {
      target: { value: "test" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith("Password mismatch", "error");
    });
  });
});

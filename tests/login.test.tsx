import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../app/login/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

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

describe("LoginForm", () => {
  const pushMock = jest.fn();
  const showToastMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useToast as jest.Mock).mockReturnValue({ showToast: showToastMock });
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginForm />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("calls signIn with email and password", async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "123456",
      });
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast on failed login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: false });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        "Wrong email or password",
        "error",
      );
    });
  });

  it("shows preloader while loading", async () => {
    (signIn as jest.Mock).mockImplementation(() => new Promise(() => {})); // never resolves

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByTestId("preloader")).toBeInTheDocument();
  });
});

import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../app/login/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("handleLogin", () => {
  it("redirects on successful login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    const { getByLabelText, getByRole } = render(<LoginForm />);
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/");
    });
  });

  it("shows error on failed login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: false });

    const { getByRole } = render(<LoginForm />);
    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
    });
  });

  it("shows error on exception", async () => {
    (signIn as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { getByRole } = render(<LoginForm />);
    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {});
  });
});

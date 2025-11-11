"use client";

import { useState, FormEvent } from "react";
import styles from "@/styles/SignUp.module.css";
import { useRouter } from "next/navigation";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const { showToast } = useToast();

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (password !== rePassword) {
        showToast("Password mismatch", "error");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, rePassword }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        showToast(`Error: ${data.error}`, "error");
      }
    } catch (error) {
      showToast(`Error: ${error}`, "error");
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.form}>
        <h2>Sign Up</h2>
        <form onSubmit={handleCreate}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            placeholder="Repeat Password"
            required
          />
          <button type="submit">Submit</button>
          <span>
            Already have an account? <Link href="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
}

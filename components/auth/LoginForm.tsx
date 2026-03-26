"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  locale: "id" | "en";
  labels: {
    loginTitle: string;
    email: string;
    password: string;
    submit: string;
    unauthorized: string;
  };
  showUnauthorized: boolean;
};

export function LoginForm({ locale, labels, showUnauthorized }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push(`/${locale}/admin`);
  }

  return (
    <div className="mx-auto mt-28 w-full max-w-md rounded-xl border border-gray-200 bg-white p-8">
      <h1 className="font-headline text-3xl font-black tracking-tight text-text">{labels.loginTitle}</h1>
      {showUnauthorized ? <p className="mt-4 text-sm text-red-600">{labels.unauthorized}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-semibold text-text">
          {labels.email}
          <input
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none ring-primary/30 focus:ring"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold text-text">
          {labels.password}
          <input
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none ring-primary/30 focus:ring"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-60"
          type="submit"
        >
          {loading ? "..." : labels.submit}
        </button>
      </form>
    </div>
  );
}

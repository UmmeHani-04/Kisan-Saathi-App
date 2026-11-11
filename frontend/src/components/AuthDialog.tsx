import { useState } from "react";
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { describeAuthError, useAuth } from "@/components/auth";
import { useLanguage } from "@/lib/siteLanguage";

type Mode = "login" | "signup";

const fieldLabel = "block text-sm font-semibold text-foreground";

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export default function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
  initialMode = "login",
  embedded = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialMode?: Mode;
  embedded?: boolean;
}) {
  const { configured, signUp, signIn, signInWithGoogle, resetPassword } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setInfo("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setError("");
      setInfo("");
      setPassword("");
    }
    onOpenChange(next);
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await action();
      setPassword("");
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    void run(() => (mode === "signup" ? signUp(name, email, password) : signIn(email, password)));
  }

  async function onForgotPassword() {
    if (!email.trim()) {
      setError("Type your email above first, then tap “Forgot password?”.");
      return;
    }
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await resetPassword(email);
      setInfo("If this email has an account, a password reset link has been sent.");
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  const content = (
    <>
      {embedded ? (
        <div className="auth-form-header">
          <h1>{mode === "login" ? t("welcomeBack") : "Create your account"}</h1>
          <p>
            {mode === "login"
              ? "Log in to continue to your farming dashboard."
              : "Sign up to get started with Kishan Saathi."}
          </p>
        </div>
      ) : (
        <DialogHeader>
          <DialogTitle>{mode === "login" ? t("welcomeBack") : "Create your account"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Log in to continue to your farming dashboard."
              : "Sign up to get started with Kishan Saathi."}
          </DialogDescription>
        </DialogHeader>
      )}

      {!configured ? (
        <span className="block rounded-md bg-accent p-4 text-sm text-foreground" role="status">
          Login is not set up yet. The site owner needs to add the Firebase settings to
          frontend/.env.
        </span>
      ) : (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={busy}
            onClick={() => void run(signInWithGoogle)}
          >
            <GoogleLogo />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use your email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="auth-name" className={fieldLabel}>
                  Your name
                </label>
                <Input
                  id="auth-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className={fieldLabel}>
                Email
              </label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className={fieldLabel}>
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary"
                    onClick={() => void onForgotPassword()}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="auth-password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "signup" && (
                <span className="block text-xs text-muted-foreground">At least 6 characters.</span>
              )}
            </div>

            {error && (
              <span className="block text-sm text-destructive" role="alert">
                {error}
              </span>
            )}
            {info && (
              <span className="block text-sm text-primary" role="status">
                {info}
              </span>
            )}

            <Button type="submit" className="w-full" disabled={busy || !email.trim() || !password}>
              {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New to Kishan Saathi? " : "Already have an account? "}
            <button
              type="button"
              className="font-semibold text-primary"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="auth-form-content">{content}</div>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">{content}</DialogContent>
    </Dialog>
  );
}

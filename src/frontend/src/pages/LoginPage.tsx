import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function CupSambraniIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 7 C9 5, 7.5 4.5, 7.5 3 C7.5 4.5, 9 5, 9 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M12 5 C12 3, 10.5 2.5, 10.5 1 C10.5 2.5, 12 3, 12 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M15 7 C15 5, 13.5 4.5, 13.5 3 C13.5 4.5, 15 5, 15 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M7 10 L8.5 19 H15.5 L17 10 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <rect x="6" y="9" width="12" height="2" rx="1" fill="currentColor" />
      <rect x="9" y="19" width="6" height="1.5" rx="0.75" fill="currentColor" />
      <rect
        x="8"
        y="20.5"
        width="8"
        height="1.5"
        rx="0.75"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { login, isLoggingIn, isInitializing, isAuthenticated } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/catalog" });
    }
  }, [isAuthenticated, navigate]);

  const isBusy = isLoggingIn || isInitializing;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm bg-card border border-border rounded-xl shadow-lg p-8 flex flex-col items-center gap-6"
          data-ocid="login.card"
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <CupSambraniIcon className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                Cup Sambarani
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Billing &amp; Catalog Management
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border" />

          {/* Sign in section */}
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Sign in with Internet Identity to access your billing dashboard.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={login}
              disabled={isBusy}
              data-ocid="login.sign_in_button"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isInitializing ? "Loading…" : "Signing in…"}
                </>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Internet Identity is a secure, privacy-preserving authentication
            service on the Internet Computer.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

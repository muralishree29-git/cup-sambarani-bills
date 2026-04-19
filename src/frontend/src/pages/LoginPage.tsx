import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

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
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="/assets/images/peacock-feather.png"
                alt="VJ Traders Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                VJ Traders
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

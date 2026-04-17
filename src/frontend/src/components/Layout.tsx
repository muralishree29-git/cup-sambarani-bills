import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LogOut,
  Package,
  Receipt,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";

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

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: "/catalog" as const, label: "Catalog", icon: Package },
  { to: "/bill" as const, label: "New Bill", icon: Receipt },
  { to: "/history" as const, label: "Bill History", icon: ScrollText },
  { to: "/customers" as const, label: "Customers", icon: Users },
  { to: "/settings" as const, label: "Settings", icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { isAuthenticated, clear, identity } = useInternetIdentity();
  const navigate = useNavigate();

  const principalText = identity
    ? `${identity.getPrincipal().toText().slice(0, 8)}…`
    : null;

  function handleSignOut() {
    clear();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-warm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/catalog"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.home_link"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shadow-xs transition-smooth group-hover:scale-105">
              <CupSambraniIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground tracking-tight">
              Cup Sambarani
            </span>
          </Link>

          {/* Navigation + user controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <nav
                className="flex items-center gap-1 mr-2"
                aria-label="Main navigation"
              >
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const isActive =
                    currentPath === to || currentPath.startsWith(`${to}/`);
                  return (
                    <Link
                      key={to}
                      to={to}
                      data-ocid={
                        `nav.${label.toLowerCase().replaceAll(" ", "_")}_link` as string
                      }
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {principalText && (
                  <span
                    className="hidden sm:block text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded"
                    title={identity?.getPrincipal().toText()}
                    data-ocid="nav.principal_label"
                  >
                    {principalText}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5"
                  data-ocid="nav.sign_out_button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

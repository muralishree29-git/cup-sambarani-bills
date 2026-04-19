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
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center transition-smooth group-hover:scale-105 overflow-hidden">
              <img
                src="/assets/images/peacock-feather.png"
                alt="VJ Traders Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-display text-lg font-semibold text-foreground tracking-tight">
              VJ Traders
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

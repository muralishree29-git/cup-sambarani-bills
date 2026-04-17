import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const BillPage = lazy(() => import("./pages/BillPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function PageLoader() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

/** Wraps pages inside Layout with auth guard. Redirects to /login if unauthenticated. */
function AuthenticatedLayout() {
  const { isAuthenticated, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster richColors position="top-right" />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/login" />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

// Authenticated sub-tree
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: AuthenticatedLayout,
});

const catalogRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/catalog",
  component: () => <CatalogPage />,
});

const billRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/bill",
  component: () => <BillPage />,
});

const historyRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/history",
  component: () => <HistoryPage />,
});

const customersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/customers",
  component: () => <CustomersPage />,
});

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  authenticatedRoute.addChildren([
    catalogRoute,
    billRoute,
    historyRoute,
    customersRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

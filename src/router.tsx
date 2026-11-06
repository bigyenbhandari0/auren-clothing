import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    defaultPreload: "viewport",
    defaultPreloadDelay: 40,
    defaultPreloadStaleTime: 30_000,
    defaultStaleTime: 30_000,
    defaultPendingMs: 5000,
    defaultPendingMinMs: 0,
    defaultViewTransition: true,
  });

  return router;
};

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { BagProvider } from "@/lib/bag";
import { WardrobeProvider } from "@/lib/wardrobe";
import { StudioLayout, useStudioEntrance } from "./StoreShell";

beforeEach(() => {
  sessionStorage.setItem("auren-intro-seen-v2", "1");
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  sessionStorage.clear();
});
function Home() {
  const ready = useStudioEntrance();
  return <h1>{ready ? "Home ready" : "Entering home"}</h1>;
}
function createTestRouter(initial = "/", loadShop?: () => Promise<void>) {
  const root = createRootRoute({
    component: () => (
      <BagProvider>
        <WardrobeProvider>
          <StudioLayout>
            <Outlet />
          </StudioLayout>
        </WardrobeProvider>
      </BagProvider>
    ),
  });
  const home = createRoute({ getParentRoute: () => root, path: "/", component: Home });
  const shop = createRoute({
    getParentRoute: () => root,
    path: "/shop",
    ...(loadShop ? { loader: loadShop } : {}),
    component: () => <h1>Collection ready</h1>,
  });
  return createRouter({
    routeTree: root.addChildren([home, shop]),
    history: createMemoryHistory({ initialEntries: [initial] }),
    defaultPendingMinMs: 0,
  });
}
describe("navigation continuity", () => {
  it("keeps the header and footer mounted while routes change", async () => {
    const router = createTestRouter();
    const view = render(<RouterProvider router={router} />);
    await screen.findByRole("heading", { name: "Home ready" });
    const header = view.container.querySelector("[data-store-header]");
    const footer = view.container.querySelector("footer");
    await act(async () => {
      await router.navigate({ to: "/shop" });
    });
    await screen.findByRole("heading", { name: "Collection ready" });
    expect(view.container.querySelector("[data-store-header]")).toBe(header);
    expect(view.container.querySelector("footer")).toBe(footer);
    expect(view.container.querySelectorAll("[data-store-shell]")).toHaveLength(1);
  });
  it("keeps the current page visible until the next route is ready", async () => {
    let finish!: () => void;
    const pending = new Promise<void>((resolve) => {
      finish = resolve;
    });
    const router = createTestRouter("/", () => pending);
    const view = render(<RouterProvider router={router} />);
    await screen.findByRole("heading", { name: "Home ready" });
    const header = view.container.querySelector("[data-store-header]");
    let navigation: Promise<void> | undefined;
    act(() => {
      navigation = router.navigate({ to: "/shop" });
    });
    await waitFor(() => expect(router.state.isLoading).toBe(true));
    expect(screen.getByRole("heading", { name: "Home ready" })).toBeVisible();
    expect(view.container.querySelector("[data-store-header]")).toBe(header);
    await act(async () => {
      finish();
      await navigation;
    });
    await screen.findByRole("heading", { name: "Collection ready" });
    expect(screen.queryByRole("heading", { name: "Home ready" })).not.toBeInTheDocument();
  });
  it("does not replay the intro when navigating back to home", async () => {
    const router = createTestRouter("/shop");
    render(<RouterProvider router={router} />);
    await screen.findByRole("heading", { name: "Collection ready" });
    await act(async () => {
      await router.navigate({ to: "/" });
    });
    expect(await screen.findByRole("heading", { name: "Home ready" })).toBeVisible();
    expect(screen.queryByRole("region", { name: "Welcome to AUREN" })).not.toBeInTheDocument();
  });
});

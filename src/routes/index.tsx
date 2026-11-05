import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { BagProvider, useBag } from "@/lib/bag";
import { LookExplorer } from "@/components/auren/LookExplorer";
import { BagModal } from "@/components/auren/BagModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AUREN — Try the Look" },
      { name: "description", content: "Explore five photographed AUREN streetwear looks and shop each piece." },
      { property: "og:title", content: "AUREN — Try the Look" },
      { property: "og:description", content: "Explore five photographed AUREN streetwear looks and shop each piece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Header() {
  const bag = useBag();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-5 lg:px-10">
      <span className="text-sm font-bold tracking-[0.2em]">AUREN</span>
      <nav className="flex items-center gap-6 text-xs">
        <span className="hidden sm:inline">Looks</span>
        <button onClick={() => bag.setOpen(true)} className="hover:opacity-60" aria-label={`Shopping bag, ${bag.count} items`}>
          Bag ({bag.count})
        </button>
      </nav>
    </header>
  );
}

function Index() {
  return (
    <BagProvider>
      <div className="flex min-h-svh flex-col overflow-x-hidden bg-background">
        <Header />
        <LookExplorer />
        <BagModal />
        <Toaster position="bottom-center" />
      </div>
    </BagProvider>
  );
}

import { useCallback, useState } from "react";
import { BrandIntro } from "@/components/auren/BrandIntro";
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
      <a href="/" aria-label="AUREN home" className="text-sm font-bold tracking-[0.2em]">AUREN</a>
      <nav className="flex items-center gap-6 text-xs">
        <a href="#looks" className="hidden hover:opacity-60 sm:inline">Looks</a>
        <button onClick={() => bag.setOpen(true)} className="hover:opacity-60" aria-label={`Shopping bag, ${bag.count} items`}>
          Bag ({bag.count})
        </button>
      </nav>
    </header>
  );
}

function Index() {
  const [entered, setEntered] = useState(false);
  const enter = useCallback(() => setEntered(true), []);
  return (
    <BagProvider>
      <BrandIntro onComplete={enter} />
      <div inert={!entered} aria-hidden={!entered} className="flex min-h-svh flex-col overflow-x-hidden bg-background">
        <Header />
        <LookExplorer />
        <BagModal />
        <Toaster position="bottom-center" />
      </div>
    </BagProvider>
  );
}

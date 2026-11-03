import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { NavLink } from "./nav-link";
import { UserMenu, UserMenuSkeleton } from "../auth/user-menu";
import { Suspense } from "react";

const NAV_ITEMS = [
  { href: "/restaurants", label: "Restaurants" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <UtensilsCrossed className="size-5" />
          Makan Finder
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto">
          <Suspense fallback={<UserMenuSkeleton />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

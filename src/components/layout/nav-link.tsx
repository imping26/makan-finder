"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  // 子路由也算 active；加 "/" 避免 /restaurants-map 误匹配 /restaurants
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        isActive && "font-medium text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

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

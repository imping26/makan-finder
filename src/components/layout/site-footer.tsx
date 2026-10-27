import Link from "next/link";
import { cacheLife } from "next/cache";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CurrentYear /> Makan Finder · Demo data is fictional
        </p>
        <nav className="flex gap-4">
          <Link href="/restaurants" className="hover:text-foreground">
            Restaurants
          </Link>
          <a
            href="https://github.com/imping26/makan-finder"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

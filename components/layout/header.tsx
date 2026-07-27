import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { churchDirectoryUrl } from "@/lib/utils";

/**
 * Two-row Apple nav: a slim black global bar, then a frosted sub-nav carrying
 * the site name and the persistent primary CTA.
 */
const globalNav = [
  { href: "/musicians", label: "Musicians" },
  { href: "/rates", label: "Rates" },
  { href: "/request-musician", label: "Request" },
  { href: "/create-profile", label: "Join" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Global nav — pure black, 44px, 12px links. */}
      <div className="bg-black text-white">
        <div className="mx-auto flex h-11 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="focus-ring flex items-center gap-2 rounded-sm" aria-label="Home">
            <LogoMark className="h-4 w-4" tone="bare" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {globalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-sm text-xs text-white/90 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={churchDirectoryUrl("/")}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-sm text-xs text-white/90 hover:text-white"
            >
              Churches
            </a>
          </nav>

          {/* Mobile tray. */}
          <details className="md:hidden">
            <summary className="focus-ring cursor-pointer list-none rounded-sm px-2 py-1 text-xs text-white">
              Menu
            </summary>
            <div className="absolute left-0 right-0 top-11 border-b border-line bg-surface p-2">
              <nav aria-label="Mobile primary" className="flex flex-col">
                {globalNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="focus-ring rounded-sm px-4 py-3 text-body text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={churchDirectoryUrl("/")}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring rounded-sm px-4 py-3 text-body text-ink"
                >
                  Browse churches
                </a>
              </nav>
            </div>
          </details>
        </div>
      </div>

      {/* Sub-nav — frosted parchment, category name left, primary CTA right. */}
      <div className="frosted border-b border-black/5">
        <div className="mx-auto flex min-h-[52px] max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="focus-ring rounded-sm">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/rates" className="focus-ring hidden rounded-sm text-sm text-ink sm:inline">
              How pricing works
            </Link>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/request-musician">Request a musician</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

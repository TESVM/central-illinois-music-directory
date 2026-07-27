import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { FLOOR_RATE, formatCurrency } from "@/lib/rates";
import { churchDirectoryUrl } from "@/lib/utils";

/**
 * Parchment footer with relaxed-leading link columns — the one place in the
 * system where density is intentional.
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas text-ink-muted">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr] lg:px-8">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            Connecting churches, worship leaders, and event planners across Champaign-Urbana with
            local musicians. Every booking starts at {formatCurrency(FLOOR_RATE)} per hour.
          </p>
        </div>

        <FooterColumn title="For organizations">
          <Link href="/musicians">Browse musicians</Link>
          <Link href="/request-musician">Request a musician</Link>
          <Link href="/rates">Rates &amp; pricing</Link>
          <a href={churchDirectoryUrl("/")} target="_blank" rel="noreferrer">
            Browse churches
          </a>
        </FooterColumn>

        <FooterColumn title="For musicians">
          <Link href="/create-profile">Create a profile</Link>
          <Link href="/rates">How pay works</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/faq">FAQ</Link>
        </FooterColumn>

        <FooterColumn title="Contact">
          <a href="mailto:hello@centralilmusicministry.com">hello@centralilmusicministry.com</a>
          <span className="text-ink-subtle">Champaign-Urbana, Illinois</span>
          <Link href="/contact">Send a message</Link>
          <Link href="/terms-privacy">Terms &amp; Privacy</Link>
        </FooterColumn>
      </div>

      <div className="mx-auto max-w-[1440px] border-t border-line px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs text-ink-subtle">
          Quoted totals are estimates. Final cost is confirmed with the organization before any
          musician is booked.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm leading-loose">{children}</div>
    </div>
  );
}

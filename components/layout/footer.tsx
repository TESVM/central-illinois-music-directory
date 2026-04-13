import Link from "next/link";
import { churchDirectoryUrl } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-brand-900 text-brand-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
        <div>
          <h2 className="font-display text-3xl">Helping churches find musicians with confidence.</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-brand-100">
            Built for pastors, churches, worship leaders, and event planners across Champaign-Urbana and the wider Central Illinois region.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/musicians">Browse Musicians</Link>
            <Link href="/create-profile">Create Profile</Link>
            <Link href="/church-search-request">Request Musicians</Link>
            <Link href="/dashboard">Dashboard</Link>
            <a href={churchDirectoryUrl("/")} target="_blank" rel="noreferrer">
              Browse Churches
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Contact</p>
          <div className="mt-4 space-y-2 text-sm text-brand-100">
            <p>hello@centralilmusicministry.com</p>
            <p>Champaign-Urbana, Illinois</p>
            <Link href="/contact">Send a message</Link>
            <Link href="/terms-privacy">Terms &amp; Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Central Illinois Music Ministry Directory",
    template: "%s | Central Illinois Music Ministry Directory"
  },
  description:
    "Accessible musician directory for Champaign-Urbana and Central Illinois churches, pastors, worship leaders, and ministry event planners.",
  openGraph: {
    title: "Central Illinois Music Ministry Directory",
    description:
      "Find experienced church musicians, vocalists, accompanists, and ministry-ready creatives across Central Illinois.",
    url: absoluteUrl("/"),
    siteName: "Central Illinois Music Ministry Directory",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

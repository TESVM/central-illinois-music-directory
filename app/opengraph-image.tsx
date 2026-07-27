import { ImageResponse } from "next/og";
import { FLOOR_RATE, formatCurrency } from "@/lib/rates";

export const runtime = "nodejs";
export const alt =
  "Central Illinois Musicians — find church musicians in Champaign-Urbana, starting at $35 an hour";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card that renders when a link to this site is shared in a text message,
 * on Facebook, or in a church newsletter. Rendered to PNG at build time by
 * Satori — no external service and no cost.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "72px 80px"
        }}
      >
        {/* Mark + name */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="15" fill="#1d1d1f" />
            <rect x="15" y="26" width="6" height="12" rx="3" fill="#ffffff" />
            <rect x="26" y="18" width="6" height="28" rx="3" fill="#ffffff" />
            <rect x="37" y="23" width="6" height="18" rx="3" fill="#ffffff" />
            <rect x="48" y="29" width="6" height="6" rx="3" fill="#ffffff" />
          </svg>
          <div
            style={{
              marginLeft: 20,
              fontSize: 30,
              fontWeight: 600,
              color: "#1d1d1f",
              letterSpacing: -0.5
            }}
          >
            Central Illinois Musicians
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#1d1d1f",
              lineHeight: 1.08,
              letterSpacing: -2.5,
              maxWidth: 940
            }}
          >
            Find church musicians in Champaign-Urbana.
          </div>
          {/*
            Satori requires an explicit display on any element with more than one
            child, so this stays a single interpolated string rather than mixed
            text and expression nodes.
          */}
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              color: "#7a7a7a",
              letterSpacing: -0.5
            }}
          >
            {`Vocalists, keys, drums, strings, and worship leaders — starting at ${formatCurrency(FLOOR_RATE)} an hour.`}
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e0e0e0",
            paddingTop: 28
          }}
        >
          <div style={{ fontSize: 26, color: "#7a7a7a" }}>
            Champaign · Urbana · Savoy · Mahomet · Rantoul
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#0066cc",
              color: "#ffffff",
              fontSize: 24,
              padding: "12px 28px",
              borderRadius: 999
            }}
          >
            Request a musician
          </div>
        </div>
      </div>
    ),
    size
  );
}

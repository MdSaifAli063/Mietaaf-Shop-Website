import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Mietaaf luxury men's ethnic and formal wear";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f8f2e8",
          background:
            "linear-gradient(135deg, #171512 0%, #2f261d 48%, #b48754 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            letterSpacing: 12,
            textTransform: "uppercase",
          }}
        >
          <span>{SITE_NAME}</span>
          <span style={{ letterSpacing: 4, fontSize: 20 }}>Bengaluru Atelier</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 104,
              lineHeight: 0.92,
              maxWidth: 880,
            }}
          >
            Luxury Men&apos;s Ethnic & Formal
          </div>
          <div
            style={{
              marginTop: 34,
              maxWidth: 780,
              fontFamily: "Arial, sans-serif",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#f2dfc2",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

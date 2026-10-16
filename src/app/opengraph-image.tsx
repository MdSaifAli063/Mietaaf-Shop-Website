import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Mietaaf Couture — custom-tailored suits, sherwanis and wedding menswear in Bangalore";
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
          color: "#302a24",
          background: "linear-gradient(135deg, #faf6ee 0%, #f3eee5 60%, #e8ddcd 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>Your Presence, Our Craft.</span>
          <span style={{ letterSpacing: 3, fontSize: 18 }}>Bangalore · Bengaluru</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 100,
              lineHeight: 1.05,
              maxWidth: 1056,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 960,
              fontFamily: "Arial, sans-serif",
              fontSize: 32,
              lineHeight: 1.35,
              color: "#795c40",
            }}
          >
            Custom-tailored suits. Wedding menswear. Personal fittings.
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "Arial, sans-serif", fontSize: 22, letterSpacing: 3, color: "#6e6256" }}>www.mietaaf.com</div>
      </div>
    ),
    size,
  );
}

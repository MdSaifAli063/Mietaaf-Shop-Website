"use client";

import { useEffect } from "react";
import Link from "next/link";

const actionStyle = {
  alignItems: "center",
  border: "1px solid #cfc2af",
  borderRadius: "999px",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  fontSize: "0.95rem",
  fontWeight: 600,
  justifyContent: "center",
  minHeight: "44px",
  padding: "0.7rem 1.5rem",
} as const;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at top left, #f1e7d8, transparent 35%), #faf7f2",
          color: "#302a24",
          display: "flex",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          justifyContent: "center",
          margin: 0,
          minHeight: "100dvh",
          padding: "1rem",
        }}
      >
        <main
          style={{
            background: "rgba(255, 252, 247, 0.94)",
            border: "1px solid #ded3c3",
            borderRadius: "1.5rem",
            boxShadow: "0 24px 70px rgba(49, 39, 27, 0.1)",
            boxSizing: "border-box",
            maxWidth: "42rem",
            padding: "clamp(2rem, 7vw, 4rem)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              color: "#a87645",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.35em",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Mietaaf atelier
          </p>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.25rem, 8vw, 3.5rem)",
              fontWeight: 500,
              lineHeight: 1.05,
              margin: "1rem 0 0",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#746a60",
              lineHeight: 1.7,
              margin: "1rem auto 0",
              maxWidth: "31rem",
            }}
          >
            The storefront could not be loaded. Try once more, or return to the home page.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{ ...actionStyle, background: "#302a24", color: "#fffaf2" }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                ...actionStyle,
                background: "transparent",
                color: "#302a24",
                textDecoration: "none",
              }}
            >
              Return home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

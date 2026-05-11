/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OgVariant = {
  eyebrow: string; // small uppercase label
  title: string; // big headline
  subtitle?: string; // smaller body
  accentFrom?: string;
  accentVia?: string;
  accentTo?: string;
  badgeColor?: string;
  badgeText?: string;
};

export function buildOg(variant: OgVariant) {
  const accentFrom = variant.accentFrom || "#a78bfa";
  const accentVia = variant.accentVia || "#7c5cff";
  const accentTo = variant.accentTo || "#22d3ee";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a14",
          color: "#e7e7f0",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: `radial-gradient(closest-side, ${accentVia}66, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: `radial-gradient(closest-side, ${accentTo}55, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(124,92,255,0.2)",
              border: "1px solid rgba(167,139,250,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#a78bfa",
            }}
          >
            ✦
          </div>
          <div
            style={{ display: "flex", fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}
          >
            fixai
            <span style={{ color: "#a78bfa", marginLeft: 0 }}>prompt</span>
          </div>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "rgba(231,231,240,0.7)",
            textTransform: "uppercase",
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          <span>{variant.eyebrow}</span>
          {variant.badgeText && (
            <span
              style={{
                padding: "4px 14px",
                borderRadius: 9999,
                background: (variant.badgeColor || "#fb7185") + "22",
                border: `2px solid ${variant.badgeColor || "#fb7185"}`,
                color: variant.badgeColor || "#fb7185",
                fontSize: 18,
                letterSpacing: 1,
                display: "flex",
              }}
            >
              {variant.badgeText}
            </span>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 28,
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 1000,
            background: `linear-gradient(135deg, ${accentFrom}, ${accentVia}, ${accentTo})`,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {variant.title}
        </div>

        {/* Subtitle */}
        {variant.subtitle && (
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(231,231,240,0.85)",
              maxWidth: 950,
              display: "flex",
            }}
          >
            {variant.subtitle}
          </div>
        )}

        {/* Footer bar */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 72,
            right: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(231,231,240,0.6)",
          }}
        >
          <span>fixaiprompt.com</span>
          <span>The privacy layer for AI</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}

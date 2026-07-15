import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          background: "#4f6f5b",
          borderRadius: 40,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            border: "7px solid #c9a75d",
            borderRadius: 30,
            bottom: 14,
            left: 14,
            position: "absolute",
            right: 14,
            top: 14,
          }}
        />
        <div
          style={{
            alignItems: "baseline",
            color: "#fffaf2",
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 65,
            fontWeight: 700,
            justifyContent: "center",
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          <span>H</span>
          <span
            style={{
              color: "#f0b7c0",
              fontSize: 53,
              fontWeight: 600,
              marginLeft: 4,
              marginRight: 4,
            }}
          >
            &amp;
          </span>
          <span>A</span>
        </div>
      </div>
    ),
    size,
  );
}

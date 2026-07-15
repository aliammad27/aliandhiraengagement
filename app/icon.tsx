import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          background: "#4f6f5b",
          borderRadius: 56,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            border: "9px solid #c9a75d",
            borderRadius: 42,
            bottom: 19,
            left: 19,
            position: "absolute",
            right: 19,
            top: 19,
          }}
        />
        <div
          style={{
            alignItems: "baseline",
            color: "#fffaf2",
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 92,
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
              fontSize: 76,
              fontWeight: 600,
              marginLeft: 5,
              marginRight: 5,
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

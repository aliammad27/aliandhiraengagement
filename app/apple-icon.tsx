import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hira and Ali";
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
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            border: "6px solid rgba(255, 250, 242, 0.18)",
            borderRadius: 999,
            height: 154,
            position: "absolute",
            width: 154,
          }}
        />
        <div
          style={{
            alignItems: "center",
            background: "#d88f9c",
            border: "7px solid #d8b86a",
            borderRadius: 999,
            display: "flex",
            height: 130,
            justifyContent: "center",
            width: 130,
          }}
        >
          <div
            style={{
              color: "#fffaf2",
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: 50,
              fontWeight: 700,
              letterSpacing: 0,
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            H&amp;A
          </div>
        </div>
      </div>
    ),
    size,
  );
}

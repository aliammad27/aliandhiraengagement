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
          background: "#fffaf2",
          border: "6px solid #d8b86a",
          color: "#4f6f5b",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            lineHeight: 1,
            marginTop: -3,
          }}
        >
          <span
            style={{
              color: "#4f6f5b",
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 66,
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            H
          </span>
          <span
            style={{
              color: "#b85f68",
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 50,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1,
              marginLeft: 2,
              marginRight: 3,
              marginTop: 8,
            }}
          >
            &amp;
          </span>
          <span
            style={{
              color: "#4f6f5b",
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 66,
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            A
          </span>
        </div>
      </div>
    ),
    size,
  );
}

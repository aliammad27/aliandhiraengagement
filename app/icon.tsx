import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hira and Ali";
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
          background: "#fffcf6",
          border: "8px solid #cdb78a",
          color: "#6f699e",
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
            marginTop: -4,
          }}
        >
          <span
            style={{
              color: "#6f699e",
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 94,
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            H
          </span>
          <span
            style={{
              color: "#9c8d7b",
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 72,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1,
              marginLeft: 3,
              marginRight: 5,
              marginTop: 12,
            }}
          >
            &amp;
          </span>
          <span
            style={{
              color: "#6f699e",
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 94,
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

import { ImageResponse } from "next/og";
export const alt =
  "India Beauty Excellence Network — Recognising Excellence in Indian Beauty.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    <div
      style={{
        background: "#f8f7f3",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "65px 80px",
        color: "#292d25",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #c9c7b9",
          paddingBottom: 25,
        }}
      >
        <div style={{ fontSize: 60, fontFamily: "serif" }}>IBEN</div>
        <div style={{ fontSize: 15, letterSpacing: 3 }}>
          INDIA BEAUTY EXCELLENCE NETWORK
        </div>
      </div>
      <div
        style={{
          fontSize: 82,
          fontFamily: "serif",
          lineHeight: 1.08,
          marginTop: 55,
        }}
      >
        Recognising Excellence
      </div>
      <div
        style={{
          fontSize: 82,
          fontFamily: "serif",
          color: "#8b7352",
          fontStyle: "italic",
        }}
      >
        in Indian Beauty.
      </div>
      <div style={{ marginTop: 38, fontSize: 16, letterSpacing: 4 }}>
        CRAFT. CHARACTER. EXCELLENCE.
      </div>
    </div>,
    size,
  );
}

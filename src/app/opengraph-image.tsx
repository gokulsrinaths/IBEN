import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const alt =
  "India Beauty Excellence Network — Recognising Excellence in Indian Beauty.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OG() {
  const [logo, hero] = await Promise.all([
    readFile(join(process.cwd(), "public/images/logo.png")),
    readFile(join(process.cwd(), "public/images/hero-illustration.jpg")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const heroSrc = `data:image/jpeg;base64,${hero.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8f7f3",
          width: "100%",
          height: "100%",
          display: "flex",
          color: "#292d25",
        }}
      >
        <div
          style={{
            width: "62%",
            display: "flex",
            flexDirection: "column",
            padding: "60px 0 60px 70px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={52} height={49} alt="" />
            <div style={{ fontSize: 42, fontFamily: "serif" }}>IBEN</div>
          </div>
          <div
            style={{
              fontSize: 66,
              fontFamily: "serif",
              lineHeight: 1.1,
              marginTop: 44,
            }}
          >
            Recognising Excellence
          </div>
          <div
            style={{
              fontSize: 66,
              fontFamily: "serif",
              color: "#8b7352",
              fontStyle: "italic",
            }}
          >
            in Indian Beauty.
          </div>
          <div style={{ marginTop: "auto", fontSize: 15, letterSpacing: 4 }}>
            CRAFT. CHARACTER. EXCELLENCE.
          </div>
        </div>
        <div
          style={{
            width: "38%",
            height: "100%",
            display: "flex",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroSrc}
            width={456}
            height={630}
            style={{ objectFit: "cover", objectPosition: "top" }}
            alt=""
          />
        </div>
      </div>
    ),
    size,
  );
}

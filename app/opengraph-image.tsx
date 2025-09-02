import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "プロイー - AI面接練習で内定を掴む";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #9fe870 0%, #8fd960 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(22, 51, 0, 0.9)",
            borderRadius: "24px",
            padding: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#9fe870",
              margin: "0 0 20px 0",
              lineHeight: 1.1,
            }}
          >
            プロイー
          </h1>
          <p
            style={{
              fontSize: "36px",
              color: "white",
              margin: "0 0 20px 0",
              fontWeight: "600",
            }}
          >
            AI面接練習で内定を掴む
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                background: "#9fe870",
                borderRadius: "20px",
                padding: "16px 32px",
                color: "#163300",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              面接AI
            </div>
            <div
              style={{
                background: "#9fe870",
                borderRadius: "20px",
                padding: "16px 32px",
                color: "#163300",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              24時間練習
            </div>
            <div
              style={{
                background: "#9fe870",
                borderRadius: "20px",
                padding: "16px 32px",
                color: "#163300",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              無料体験
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { ImageResponse } from "next/og";

export const alt = "ELLA Semijoias";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagem de preview (Open Graph) da marca — aparece quando o link é colado no
 * WhatsApp/Instagram. Herdada por todas as rotas que não definem a própria.
 * Varredura: SEO "sem opengraph-image".
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF1ED 0%, #F0DCC4 100%)",
          color: "#251008",
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontFamily: "Georgia, serif",
            letterSpacing: 10,
            lineHeight: 1,
          }}
        >
          ELLA
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#8A6E5C",
            letterSpacing: 14,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#D99A30" }}>✦</span>
          Semijoias
          <span style={{ color: "#D99A30" }}>✦</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

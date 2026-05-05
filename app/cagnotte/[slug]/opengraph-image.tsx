import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "Cagnotte ChipIn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;

  const { data } = await supabase
    .from("cagnottes")
    .select("title, description, total_raised, goal")
    .eq("slug", slug)
    .single();

  const title = data?.title ?? "Cagnotte ChipIn";
  const description = data?.description ?? "Participez à cette cagnotte sur ChipIn.";
  const raised = data ? (data.total_raised / 100).toLocaleString("fr-FR") : "0";
  const goal = data?.goal ? (data.goal / 100).toLocaleString("fr-FR") : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#09090b",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "22px", fontWeight: "bold" }}>C</span>
          </div>
          <span style={{ color: "#a1a1aa", fontSize: "22px", fontWeight: "600" }}>ChipIn</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <h1
            style={{
              color: "white",
              fontSize: title.length > 40 ? "52px" : "64px",
              fontWeight: "800",
              lineHeight: 1.1,
              margin: "0 0 24px 0",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "28px",
                lineHeight: 1.5,
                margin: "0 0 40px 0",
                maxWidth: "900px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {description}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "#166534",
                borderRadius: "999px",
                padding: "8px 20px",
                display: "flex",
              }}
            >
              <span style={{ color: "#86efac", fontSize: "20px", fontWeight: "600" }}>
                {raised} € collectés{goal ? ` / ${goal} €` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

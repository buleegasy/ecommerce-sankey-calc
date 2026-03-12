"use client";

import { ResponsiveSankey } from "@nivo/sankey";
import { SankeyData } from "../types";

interface Props {
  data: SankeyData;
}

export default function SankeyChart({ data }: Props) {
  return (
    <div className="h-[600px] w-full glass glass-hover p-8 relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-blue-500/10 transition-colors duration-700" />
      
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 180, bottom: 40, left: 60 }}
        align="justify"
        colors={(node) => node.nodeColor || "#3b82f6"}
        nodeOpacity={1}
        nodeThickness={20}
        nodeInnerPadding={4}
        nodeSpacing={28}
        nodeBorderWidth={0}
        linkOpacity={0.6}
        linkHoverOthersOpacity={0.05}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={20}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 0.5]],
        }}
        theme={{
          labels: {
            text: {
              fontSize: 13,
              fontWeight: 800,
              fill: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
          },
          tooltip: {
            container: {
              background: "#0f172a",
              color: "#f8fafc",
              fontSize: 12,
              borderRadius: 12,
              padding: "12px 16px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
            },
          },
        }}
        valueFormat={(value) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)
        }
      />
    </div>
  );
}

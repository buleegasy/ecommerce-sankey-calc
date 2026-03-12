"use client";

import { ResponsiveSankey } from "@nivo/sankey";
import { SankeyData } from "../types";

interface Props {
  data: SankeyData;
}

export default function SankeyChart({ data }: Props) {
  return (
    <div className="h-[500px] w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
        align="justify"
        colors={(node) => node.nodeColor || "#3182bd"}
        nodeOpacity={1}
        nodeThickness={18}
        nodeInnerPadding={3}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{
          from: "color",
          modifiers: [["darker", 0.8]],
        }}
        linkOpacity={0.5}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1]],
        }}
        theme={{
          labels: {
            text: {
              fontSize: 14,
              fontWeight: 600,
              fill: "#f8fafc",
            },
          },
          tooltip: {
            container: {
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: 12,
              borderRadius: 8,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
        valueFormat={(value) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }).format(value)
        }
      />
    </div>
  );
}

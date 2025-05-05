import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

import { ParentSize } from "@visx/responsive";

import { Treemap, hierarchy, treemapSquarify } from "@visx/hierarchy";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { scaleOrdinal, scaleLinear } from "@visx/scale";

import { opacifyColor } from "../../utils";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import TooltipCard from "./TooltipCard"; // <-- your updated one

export default function FlatTreemap({ data, color = "#fefefe", onClick }) {
    const distribution = data?.distribution ?? [];
    const theme = useTheme().chartS;

    const margin = { ...theme.margin };

    const colorScale = scaleLinear({
        domain: [],
        range: [
            opacifyColor(color, 0.2),
            opacifyColor(color, 0.4),
            opacifyColor(color, 0.6),
            opacifyColor(color, 0.8),
            color,
        ],
    });

    // Fake a "root" just to satisfy Treemap API
    const tree = useMemo(() => {
        const root = {
            name: "root",
            children: distribution.map((d) => ({
                label: d.label,
                count: d.count,
                color: d.color,
                active: d.active,
            })),
        };

        return hierarchy(root).sum((d) => d.count);
    }, [distribution]);

    return (
        <ParentSize>
            {({ width, height }) => {
                if (width === 0 || height === 0) return null;

                const innerWidth = width - margin.left - margin.right;
                const innerHeight = height - margin.top - margin.bottom;
                return (
                    <svg
                        width={width}
                        height={height}
                    >
                        <Treemap
                            root={tree}
                            size={[innerWidth, innerHeight]}
                            tile={treemapSquarify}
                            round
                            padding={2}
                        >
                            {(treemap) => (
                                <Group
                                    top={margin.top}
                                    left={margin.left}
                                >
                                    {treemap.leaves().map((node, i) => {
                                        const { x0, x1, y0, y1 } = node;
                                        const w = x1 - x0;
                                        const h = y1 - y0;
                                        const label = node.data.label;
                                        const paletteColor = node.data.color;

                                        return (
                                            <Group
                                                key={i}
                                                left={x0}
                                                top={y0}
                                            >
                                                <LinearGradient
                                                    id={`gradient-${i}`}
                                                    from={paletteColor}
                                                    to={paletteColor}
                                                    fromOpacity={1}
                                                    toOpacity={0.7}
                                                />
                                                <rect
                                                    width={w}
                                                    height={h}
                                                    fill={
                                                        // node.data.active
                                                        //     ? `url(#gradient-${i})`
                                                        //     : "transparent"
                                                        `url(#gradient-${i})`
                                                    }
                                                    opacity={
                                                        node.data.active
                                                            ? 1
                                                            : 0.1
                                                    }
                                                    onClick={(e) => {
                                                        onClick?.(label);
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    // stroke={color}
                                                />
                                                {w > 40 && h > 20 && (
                                                    <foreignObject
                                                        x={4}
                                                        y={4}
                                                        width={w - 8}
                                                        height={h - 8}
                                                        pointerEvents="none"
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "white",
                                                                fontFamily:
                                                                    "Work Sans",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {label}
                                                        </div>
                                                    </foreignObject>
                                                )}
                                            </Group>
                                        );
                                    })}
                                </Group>
                            )}
                        </Treemap>
                    </svg>
                );
            }}
        </ParentSize>
    );
}

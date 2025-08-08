import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import {
    XYChart,
    AnimatedAxis,
    AnimatedGrid,
    GlyphSeries,
    buildChartTheme,
    Tooltip,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { Circle } from "@visx/shape";

import { useChartLayout } from "../../utils.js";

import TooltipCard from "./TooltipCard.jsx";

const xAccessor = (d) => d.id; // Use the index as X
const yAccessor = (d) => d.bin; // Use the bin as Y

export default function ScatterChart({ data, color = "#fefefe" }) {
    const theme = useTheme().chartS;
    const distribution = data?.distribution ?? [];
    const empty = distribution.length === 0;

    // Setting margin
    const margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50,
    };

    const [minX, maxX, minY, maxY] = useMemo(() => {
        const yVals = distribution.map(yAccessor);
        return [
            0,
            distribution.length ? distribution.length - 1 : 10,
            yVals.length ? Math.min(...yVals) : 0,
            yVals.length ? Math.max(...yVals) : 1,
        ];
    }, [distribution]);

    const scatterData = empty ? [{ bin: 0, id: 0 }] : distribution;

    const CustomAnimatedAxis = ({ orientation, label }) => (
        <AnimatedAxis
            orientation={orientation}
            label={label}
            tickLabelProps={() => ({
                ...theme.axisTickLabelProps,
                textAnchor: orientation === "bottom" ? "middle" : "end",
            })}
            stroke={color}
            strokeWidth={theme.axis.strokeWidth}
        />
    );

    return (
        <ParentSize>
            {({ width, height }) => {
                if (width === 0 || height === 0) return null;

                const { chartHeight } = useChartLayout(
                    width,
                    height,
                    minX,
                    maxX,
                    minY,
                    maxY,
                    theme
                );

                return (
                    <XYChart
                        height={chartHeight}
                        width={width}
                        xScale={{
                            type: "linear",
                            domain: [minX, maxX],
                            zero: false,
                            nice: true,
                            clamp: true,
                        }}
                        yScale={{
                            type: "linear",
                            domain: [minY, maxY],
                            zero: false,
                            nice: true,
                        }}
                        theme={buildChartTheme({ ...theme })}
                        margin={{ ...theme.margin, bottom: 50 }}
                    >
                        <AnimatedGrid
                            columns
                            rows
                            lineStyle={{
                                ...theme.gridLineStyle,
                                strokeDasharray: "2,5",
                            }}
                        />
                        <CustomAnimatedAxis
                            orientation="bottom"
                            label="Index"
                        />
                        <CustomAnimatedAxis
                            orientation="left"
                            label="Bin"
                        />
                        <GlyphSeries
                            dataKey="distribution"
                            data={scatterData}
                            xAccessor={xAccessor}
                            yAccessor={yAccessor}
                            renderGlyph={({ x, y, datum }) => (
                                <rect
                                    x={x - 8}
                                    y={y - 8}
                                    width={16}
                                    height={16}
                                    fill={color}
                                    style={{ cursor: "pointer" }}
                                />
                                // <Circle
                                //     cx={x}
                                //     cy={y}
                                //     r={8}
                                //     fill={color}
                                //     style={{ cursor: "pointer" }}
                                // />
                            )}
                        />
                        <TooltipXY
                            color={color}
                            legend={false}
                        />
                    </XYChart>
                );
            }}
        </ParentSize>
    );
}

function TooltipXY({ color }) {
    const theme = useTheme();

    return (
        <Tooltip
            snapTooltipToDatumY
            snapTooltipToDatumX
            showVerticalCrosshair
            verticalCrosshairStyle={{
                stroke: color,
                strokeWidth: 1.5,
                strokeDasharray: "4,4",
            }}
            showDatumGlyph
            glyphStyle={{
                fill: color,
                stroke: theme.palette.white.main,
                strokeWidth: 1.5,
            }}
            renderTooltip={({ tooltipData }) => {
                const datum = tooltipData?.nearestDatum?.datum;
                console.log(datum);
                return datum ? (
                    <TooltipCard
                        vals={datum.range}
                        color={color}
                        image={datum.representatives[0].document.image_url}
                        align="center"
                        legend={false}
                    />
                ) : null;
            }}
        />
    );
}

// renderTooltip={({ tooltipData }) => {
//     const datum = tooltipData?.nearestDatum?.datum;
//     return datum ? (
//         <></>
//     ) : // <TooltipCard
//     //     vals={datum.range}
//     //     color={color}
//     //     align="center"
//     // />
//     null;
// }}

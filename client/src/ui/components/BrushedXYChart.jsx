import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
    XYChart,
    AnimatedAxis,
    AreaSeries,
    Grid,
    LineSeries,
    TooltipProvider,
    buildChartTheme,
    Tooltip,
} from "@visx/xychart";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";

import TooltipCard from "./TooltipCard.jsx";
import BrushChart from "./BrushChart.jsx";
import {
    getDomain,
    useChartLayout,
    xAccessor,
    yAccessor,
} from "../../utils.js";

export default function BrushedXYChart({
    data,
    color = "#fefefe",
    filter = { min: "", max: "" },
    onEnd,
    onExternalUpdate,
    initialBrushDomain,
}) {
    const theme = useTheme().chartS;
    const distribution = data?.distribution ?? [];
    const empty = distribution.length === 0;
    const lineData = empty ? [{ value: 0, count: 0 }] : distribution;

    const [brushDomain, setBrushDomain] = useState(null);

    // Full domain
    const [fullMinX, fullMaxX, fullMinY, fullMaxY] = useMemo(
        () => getDomain(distribution, xAccessor, yAccessor),
        [distribution]
    );

    // Set initial brush domain if provided
    useEffect(() => {
        const valid = filter.min !== "" && filter.max !== "";

        if (valid) {
            setBrushDomain({
                y0: fullMinY,
                y1: fullMaxY,
                x0: Number(filter.min),
                x1: Number(filter.max),
            });
        }
    }, [filter.min, filter.max, fullMinY, fullMaxY]);

    // Filtered data based on brush
    const filteredData = useMemo(() => {
        if (!brushDomain) return lineData;
        return lineData.filter(
            (d) =>
                xAccessor(d) >= brushDomain.x0 && xAccessor(d) <= brushDomain.x1
        );
    }, [brushDomain, lineData]);

    // Filtered domain
    const [minX, maxX, minY, maxY] = useMemo(
        () =>
            getDomain(filteredData, xAccessor, yAccessor, [fullMinX, fullMaxX]),
        [filteredData, fullMinX, fullMaxX]
    );

    // Update parent component on brush change
    const handleBrushEnd = (finalDomain) => {
        onEnd?.(finalDomain);
    };

    return (
        <ParentSize>
            {({ width, height }) => {
                if (width === 0 || height === 0) return null;

                const {
                    chartHeight,
                    brushHeight,
                    brushMargin,
                    brushXScale,
                    brushYScale,
                    brushInnerWidth,
                    brushInnerHeight,
                } = useChartLayout(
                    width,
                    height,
                    fullMinX,
                    fullMaxX,
                    fullMinY,
                    fullMaxY,
                    theme
                );

                return (
                    <>
                        <XYChart
                            style={{ pointerEvents: "auto" }}
                            height={chartHeight}
                            width={width}
                            xScale={{
                                type: "linear",
                                domain: [minX, maxX],
                                zero: false,
                                clamp: true,
                            }}
                            yScale={{
                                type: "linear",
                                domain: [minY, maxY],
                                clamp: true,
                            }}
                            theme={buildChartTheme({ ...theme })}
                            margin={{ ...theme.margin, bottom: 50 }}
                        >
                            <LinearGradient
                                id="area-gradient"
                                from={color}
                                to={color}
                                fromOpacity={0.8}
                                toOpacity={0}
                            />

                            <Grid
                                columns
                                rows
                                lineStyle={{
                                    ...theme.gridLineStyle,
                                    strokeDasharray: "2,5",
                                }}
                            />

                            <AreaSeries
                                dataKey="filtered"
                                data={filteredData}
                                xAccessor={xAccessor}
                                yAccessor={yAccessor}
                                fill="url(#area-gradient)"
                                curve={curveMonotoneX}
                            />
                            <LineSeries
                                dataKey="line"
                                data={filteredData}
                                xAccessor={xAccessor}
                                yAccessor={yAccessor}
                                curve={curveMonotoneX}
                                stroke={color}
                                strokeWidth={1}
                            />

                            <AnimatedAxis
                                orientation="bottom"
                                label={data?.column ?? ""}
                                tickLabelProps={() => ({
                                    ...theme.axisTickLabelProps,
                                    textAnchor: "middle",
                                })}
                                stroke={color}
                            />
                            <AnimatedAxis
                                orientation="left"
                                tickLabelProps={() => ({
                                    ...theme.axisTickLabelProps,
                                    textAnchor: "end",
                                })}
                                stroke={color}
                            />

                            <TooltipXY color={color} />
                        </XYChart>

                        <BrushChart
                            width={width}
                            height={brushHeight}
                            color={color}
                            lineData={lineData}
                            brushMargin={brushMargin}
                            brushXScale={brushXScale}
                            brushYScale={brushYScale}
                            brushInnerWidth={brushInnerWidth}
                            brushInnerHeight={brushInnerHeight}
                            onBrushChange={setBrushDomain}
                            onBrushEnd={handleBrushEnd}
                        />
                    </>
                );
            }}
        </ParentSize>
    );
}

function TooltipXY({ color }) {
    const theme = useTheme();

    return (
        <Tooltip
            showVerticalCrosshair
            snapTooltipToDatumX
            snapTooltipToDatumY
            showDatumGlyph
            glyphStyle={{
                fill: color,
                stroke: theme.palette.white.main,
                strokeWidth: 1.5,
            }}
            renderTooltip={({ tooltipData }) => {
                const datum = tooltipData?.nearestDatum?.datum;
                return datum ? (
                    <TooltipCard
                        vals={datum}
                        color={color}
                    />
                ) : null;
            }}
        />
    );
}

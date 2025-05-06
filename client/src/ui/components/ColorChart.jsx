// RadialColorWheel.jsx
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect } from "react";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Circle, Line } from "@visx/shape";

import {
    polarToCartesian,
    getAngleFromMouse,
    computeBrushArc,
    isInArc,
} from "../../utils.js";
import TooltipCard from "./TooltipCard.jsx";
import BrushRadial from "./BrushRadial.jsx";
import { useStore } from "../../store/useStore";

export default function RadialColorWheel({
    data = [],
    color = "#fff",
    onFilter,
    initialBrushAngles = [0, 360],
    domainL = [0, 1],
    domainS = [0, 1],
}) {
    const theme = useTheme();
    const { chartS, tooltipS } = theme;
    const margin = chartS.margin || {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    };

    const info = useStore((state) => state.info);

    const [hoveredDatum, setHoveredDatum] = useState(null);
    const [clickedData, setClickedData] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [brushAngles, setBrushAngles] = useState(initialBrushAngles);
    const [pivot, setPivot] = useState(0);

    const filteredData = useMemo(() => {
        return data.filter((d) => {
            const h = d.hue;
            const s = d.saturation;
            const l = d.lightness;

            if (
                s < Number(domainS[0]) ||
                s > Number(domainS[1]) ||
                l < Number(domainL[0]) ||
                l > Number(domainL[1])
            ) {
                return false;
            }

            return isInArc(h, brushAngles);
        });
    }, [data, brushAngles, domainL, domainS]);

    useEffect(() => {
        if (filteredData.length > 0 && brushAngles.length > 0) {
            onFilter({
                range: brushAngles.map((angle) => Number(angle).toFixed(2)),
                ids: filteredData.map((d) => d._id),
            });
        } else {
            onFilter({ range: [0, 360], ids: [] });
        }
    }, [filteredData]);

    return (
        <ParentSize>
            {({ width, height }) => {
                if (width === 0 || height === 0) return null;

                const innerWidth = width - margin.left - margin.right;
                const innerHeight = height - margin.top - margin.bottom;
                const cx = innerWidth / 2;
                const cy = innerHeight / 2;
                const rMax = Math.min(cx, cy);

                const rScale = scaleLinear({
                    domain: [0, 1],
                    range: [0, rMax],
                });

                return (
                    <svg
                        width={width}
                        height={height}
                    >
                        <Group
                            top={margin.top}
                            left={margin.left}
                        >
                            <Group
                                top={cy}
                                left={cx}
                            >
                                {/* // Bush */}
                                <BrushRadial
                                    center={{ cx, cy }}
                                    color={color}
                                    radius={rMax}
                                    innerRadius={rMax - 50}
                                    brushAngles={brushAngles}
                                    pivot={pivot}
                                />

                                {/* // Action ring */}
                                <Circle
                                    cx={0}
                                    cy={0}
                                    r={rMax + 100}
                                    fill="transparent"
                                    onMouseDown={(e) => {
                                        const start = getAngleFromMouse(
                                            e,
                                            margin
                                        );
                                        setPivot(start);
                                    }}
                                    onMouseUp={(e) => {
                                        const angle = getAngleFromMouse(
                                            e,
                                            margin
                                        );
                                        setBrushAngles(
                                            computeBrushArc(pivot, angle)
                                        );
                                    }}
                                    style={{ cursor: "crosshair" }}
                                />

                                {/* Grid  */}
                                <RadialGrid
                                    rMax={rMax}
                                    color={color}
                                    subdivs={5}
                                />

                                {data.map((d, i) => {
                                    // if (!data.active) return null;
                                    const { hue, saturation, dominant_color } =
                                        d;
                                    const radius = rScale(saturation);
                                    const { x, y } = polarToCartesian(
                                        hue,
                                        radius
                                    );

                                    return (
                                        <Circle
                                            key={i}
                                            cx={x}
                                            cy={y}
                                            r={0.5}
                                            fill={color}
                                            stroke="none"
                                            opacity={0.5}
                                            style={{ pointerEvents: "none" }}
                                        />
                                    );
                                })}

                                {filteredData.map((d, i) => {
                                    const { hue, saturation, dominant_color } =
                                        d;
                                    const radius = rScale(saturation);
                                    const { x, y } = polarToCartesian(
                                        hue,
                                        radius
                                    );

                                    return (
                                        <Circle
                                            key={i}
                                            cx={x}
                                            cy={y}
                                            r={4}
                                            fill={dominant_color}
                                            strokeWidth={
                                                hoveredDatum === d
                                                    ? 10
                                                    : clickedData.includes(d)
                                                    ? 2
                                                    : 0.1
                                            }
                                            stroke={theme.palette.white.main}
                                            onMouseOver={(e) => {
                                                setHoveredDatum(d);
                                                setMousePos({
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                });
                                            }}
                                            onMouseOut={() =>
                                                setHoveredDatum(null)
                                            }
                                            onClick={(e) => {
                                                if (clickedData.includes(d)) {
                                                    setClickedData(
                                                        clickedData.filter(
                                                            (item) => item !== d
                                                        )
                                                    );
                                                } else {
                                                    d.mousePos = {
                                                        x: mousePos.x,
                                                        y: mousePos.y,
                                                    };
                                                    setClickedData([
                                                        ...clickedData,
                                                        d,
                                                    ]);
                                                }
                                            }}
                                            style={{ cursor: "pointer" }}
                                        />
                                    );
                                })}
                            </Group>
                        </Group>

                        {clickedData.map((datum, index) => (
                            <foreignObject
                                key={index}
                                x={datum.mousePos.x - width / 2 + 100 + 20}
                                y={datum.mousePos.y - margin.top + 20 + 8}
                                width={200}
                                height={"100%"}
                                pointerEvents="none"
                            >
                                <TooltipCard
                                    vals={info
                                        .slice(0, 2)
                                        .reduce((acc, column) => {
                                            acc[column] = datum[column];
                                            return acc;
                                        }, {})}
                                    color={color}
                                    image={datum.image_url}
                                    onToolipClick={(inside) => {
                                        console.log(
                                            "inside",
                                            inside,
                                            "datum",
                                            datum
                                        );
                                        setClickedData(
                                            clickedData.filter(
                                                (e) => e !== datum
                                            )
                                        );
                                    }}
                                />
                            </foreignObject>
                        ))}

                        {hoveredDatum && (
                            <foreignObject
                                // x={mousePos.x - width / 2 + 100 + 20}
                                // y={mousePos.y - 40}
                                x={mousePos.x - width / 2 + 100 + 20}
                                y={mousePos.y - margin.top + 20 + 8}
                                width={200}
                                height={"100%"}
                                pointerEvents="none"
                            >
                                <TooltipCard
                                    vals={info
                                        .slice(0, 2)
                                        .reduce((acc, column) => {
                                            acc[column] = hoveredDatum[column];
                                            return acc;
                                        }, {})}
                                    color={color}
                                    image={hoveredDatum.image_url}
                                />
                            </foreignObject>
                        )}
                    </svg>
                );
            }}
        </ParentSize>
    );
}

function RadialGrid({ rMax, color, subdivs = 5 }) {
    const theme = useTheme();
    const { chartS } = theme;

    return (
        <>
            <Circle
                cx={0}
                cy={0}
                r={rMax}
                fill="none"
                stroke={color}
            />
            {[...Array(subdivs - 1)].map((_, i) => {
                const radius = rMax * ((i + 1) / subdivs);
                return (
                    <Circle
                        key={`grid-${i}`}
                        cx={0}
                        cy={0}
                        r={radius}
                        fill="none"
                        stroke={chartS.gridLineStyle.stroke}
                        strokeWidth={chartS.gridLineStyle.strokeWidth}
                        strokeDasharray={chartS.gridLineStyle.strokeDasharray}
                    />
                );
            })}
        </>
    );
}

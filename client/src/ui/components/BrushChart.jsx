import React from "react";
import { Group } from "@visx/group";
import { PatternLines } from "@visx/pattern";
import { LinePath } from "@visx/shape";
import { Brush } from "@visx/brush";
import { curveMonotoneX } from "@visx/curve";
import { xAccessor, yAccessor } from "../../utils.js";

export default function BrushChart({
    width,
    height,
    color,
    lineData,
    brushMargin,
    brushXScale,
    brushYScale,
    brushInnerWidth,
    brushInnerHeight,
    onBrushChange,
    onBrushEnd,
    initialBrushPosition,
}) {
    return (
        <svg
            width={width}
            height={height}
        >
            <Group
                top={brushMargin.top}
                left={brushMargin.left}
            >
                <LinePath
                    data={lineData}
                    x={(d) => brushXScale(xAccessor(d))}
                    y={(d) => brushYScale(yAccessor(d))}
                    stroke={color}
                    strokeWidth={2}
                    curve={curveMonotoneX}
                />
                <Brush
                    xScale={brushXScale}
                    yScale={brushYScale}
                    width={brushInnerWidth}
                    height={brushInnerHeight}
                    margin={brushMargin}
                    handleSize={10}
                    resizeTriggerAreas={["left", "right"]}
                    brushDirection="horizontal"
                    onChange={onBrushChange}
                    onBrushEnd={onBrushEnd}
                    selectedBoxStyle={{
                        fill: "url(#area-gradient)",
                        stroke: color,
                    }}
                    initialBrushPosition={initialBrushPosition}
                />
            </Group>
        </svg>
    );
}

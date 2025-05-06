import React, { useMemo, useCallback } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Circle } from "@visx/shape";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";

import { hexToHsv } from "../../utils";

const size = 600;
const buffer = 50;
const radius = size / 2;

export default function ColorChart({ data, handleHover = null }) {
    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
        useTooltip();

    const points = useMemo(() => {
        if (!data) return [];
        return data.map((d, i) => {
            const [h, s, v] = hexToHsv(d.dominant_color);
            const angle = (h * Math.PI) / 180;
            const x = Math.cos(angle) * radius * (s / 100) + radius;
            const y = Math.sin(angle) * radius * (s / 100) + radius;
            return {
                id: i,
                x,
                y,
                color: d.dominant_color,
                meta: d,
            };
        });
    }, [data]);

    const handleMouseOver = useCallback(
        (event, point) => {
            const coords = localPoint(event);
            showTooltip({
                tooltipLeft: coords.x,
                tooltipTop: coords.y,
                tooltipData: point,
            });
            if (handleHover) handleHover(point.id);
        },
        [showTooltip, handleHover]
    );

    return (
        <>
            <svg
                width={size}
                height={size}
                style={{
                    position: "absolute",
                    left: `${-size / 2}px`,
                    top: `${-size / 2}px`,
                    zIndex: 3,
                }}
            >
                <Group>
                    {points.map((point, idx) => (
                        <Circle
                            key={idx}
                            cx={point.x}
                            cy={point.y}
                            r={3}
                            fill="black"
                            onMouseMove={(e) => handleMouseOver(e, point)}
                            onMouseLeave={hideTooltip}
                            style={{ cursor: "pointer" }}
                        />
                    ))}
                </Group>
            </svg>

            {/* Color wheel background */}
            <div
                style={{
                    zIndex: 0,
                    position: "absolute",
                    left: `${-size / 2}px`,
                    top: `${-size / 2}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "100%",
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            >
                <img
                    src="./colorwheel.jpg"
                    loading="lazy"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* Dashed compass overlay */}
            <Compass
                size={size}
                buffer={buffer}
            />

            {/* Tooltip */}
            {tooltipData && (
                <TooltipWithBounds
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={{
                        backgroundColor: "white",
                        padding: 12,
                        border: "1px solid #ccc",
                        maxWidth: 220,
                    }}
                >
                    <div style={{ marginBottom: 8 }}>
                        <img
                            src={tooltipData.meta.image_url}
                            style={{
                                width: "100%",
                                maxHeight: "150px",
                                objectFit: "contain",
                            }}
                            alt="Artwork"
                        />
                    </div>
                    <div>
                        <strong>{tooltipData.meta.artwork_name}</strong>
                        <br />
                        {tooltipData.meta.artist_full_name}
                    </div>
                </TooltipWithBounds>
            )}
        </>
    );
}

function Compass({ size, buffer }) {
    const radius = (size + buffer) / 2;
    return (
        <svg
            width={size + buffer}
            height={size + buffer}
            style={{
                position: "absolute",
                left: `${-radius}px`,
                top: `${-radius}px`,
                zIndex: 0,
                cursor: "pointer",
            }}
        >
            <circle
                cx={radius}
                cy={radius}
                r={(size + buffer) / 2}
                fill="none"
                stroke="#ebebeb"
                strokeWidth={2}
                strokeDasharray="2, 2"
            />
        </svg>
    );
}

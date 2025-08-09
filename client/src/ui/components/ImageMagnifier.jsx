import { useState, useRef } from "react";
import { Box } from "@mui/material";

export default function ImageMagnifier({
    entry,
    color = "white",
    width = 200,
    height = 200,
}) {
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showLens, setShowLens] = useState(false);
    const containerRef = useRef(null);
    const lensRef = useRef(null);

    const radius = 200;
    const handleMouseMove = (event) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        lensRef.current.style.backgroundPosition = `-${x}px -${y}px`;
        setZoomPosition({ x, y });
    };

    return (
        <Box
            sx={{
                width: "70%",
                maxWidth: "70%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                p: 10,
            }}
        >
            {entry && (
                <>
                    <img
                        ref={containerRef}
                        src={entry.image_url}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setShowLens(true)}
                        onMouseLeave={() => setShowLens(false)}
                        loading="lazy"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                    {showLens && (
                        <div
                            ref={lensRef}
                            style={{
                                position: "absolute",
                                left: `${zoomPosition.x - radius / 4}px`,
                                top: `${zoomPosition.y - radius}px`,
                                width: `${radius / 2}px`,
                                height: `${radius / 2}px`,
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: color,
                                pointerEvents: "none",
                                background: `url(${entry.image_url}) no-repeat`,
                                transform: "scale(2)",
                                borderRadius: "100%",
                                transformOrigin: `${-radius / 2}px ${
                                    -radius / 2
                                }px`,
                                boxShadow: "5px 5px 12px rgba(0, 0, 0, 0.5)",
                            }}
                        />
                    )}
                </>
            )}
        </Box>
    );
}

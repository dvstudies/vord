import { Box, Slider, Typography, Stack, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState, Fragment } from "react";
import { useTheme } from "@mui/material/styles";

import { opacifyColor } from "../../utils.js";

import ImageMagnifier from "./ImageMagnifier.jsx";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Carousel({ index, data, color, onEnd }) {
    const theme = useTheme();
    const [activeId, setActiveId] = useState(index || 0);
    const [hovered, setHovered] = useState(false);
    const pileL = 3;

    const buttonS = {
        color: theme.palette.white.main,

        backgroundColor: opacifyColor(color, 1),
        "&:hover": {
            backgroundColor: opacifyColor(color, 0.8),
        },
    };

    const handleSlide = (_, newIndex) => {
        setActiveId(newIndex);
    };

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 2,
                boxSizing: "border-box",
                position: "relative",
                zIndex: 1,
                // overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // overflow: "hidden",
                }}
            >
                {data.map((item, i) => {
                    const offset = i - activeId;
                    if (Math.abs(offset) > pileL) return null;

                    const zIndex = offset === 0 ? 10 : pileL - Math.abs(offset);
                    const active = i === activeId;

                    const side = offset > 0;
                    const translateX = active
                        ? 0
                        : (side ? 100 : -100) + offset * 20;
                    const rotateY = active ? 0 : side ? 50 : -50;
                    const skewY = active ? 0 : side ? 10 : -10;

                    const animationProps = {
                        x: translateX + "%",
                        scale: 1,
                        rotateY,
                        skewY,
                    };

                    return (
                        <Fragment key={i}>
                            <CarouselImage
                                theme={theme}
                                item={item}
                                active={active}
                                offset={offset}
                                color={color}
                                zIndex={zIndex}
                                animationProps={animationProps}
                                clickedIndex={() => {
                                    setActiveId(i);
                                    onEnd(i);
                                }}
                                onHover={setHovered}
                            />
                            {active && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        height: "auto",
                                        width: "auto",
                                        backgroundColor: color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        px: 2,
                                        py: 1,
                                        mb: 2,
                                        zIndex: 20,
                                        borderRadius: 2000,
                                        opacity: hovered ? 1 : 0,
                                        transform: hovered
                                            ? "translateY(0%)"
                                            : "translateY(-50%)",
                                        transition:
                                            "transform 0.3s, opacity 0.3s",
                                    }}
                                >
                                    <Typography
                                        as="p"
                                        sx={{
                                            color: theme.palette.white.main,
                                        }}
                                    >
                                        {`${item.artist_full_name} - ${item.artwork_name}`}
                                    </Typography>
                                </Box>
                            )}
                        </Fragment>
                    );
                })}
            </Box>

            <Box
                sx={{
                    py: 2,
                    px: 4,
                    display: " flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <IconButton
                        sx={{
                            ...buttonS,
                        }}
                        onClick={() => {
                            const newId = Math.max(activeId - 1, 0);
                            setActiveId(newId);
                            onEnd(newId);
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton
                        sx={{
                            ...buttonS,
                        }}
                        onClick={() => {
                            const newId = Math.min(
                                activeId + 1,
                                data.length - 1
                            );
                            setActiveId(newId);
                            onEnd(newId);
                        }}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </Stack>

                <Slider
                    sx={{
                        color,
                        width: "50%",
                    }}
                    value={activeId}
                    min={0}
                    max={data.length - 1}
                    step={1}
                    onChange={handleSlide}
                    onChangeCommitted={() => onEnd(activeId)}
                />
            </Box>
        </Box>
    );
}

function CarouselImage({
    item,
    theme,
    active,
    offset,
    color,
    zIndex,
    animationProps,
    clickedIndex,
    onHover,
}) {
    const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 });
    const [loaded, setLoaded] = useState(false);

    const getMaxDimension = () => {
        const max = 50; // vh
        const { w, h } = naturalSize;

        if (w > h) {
            const ratio = h / w;
            return { width: `${max}vh`, height: `${max * ratio}vh` };
        } else {
            const ratio = w / h;
            return { width: `${max * ratio}vh`, height: `${max}vh` };
        }
    };

    const inactiveSize = { width: "30vh", height: "30vh" };
    const activeSize =
        loaded && loaded !== "error" ? getMaxDimension() : { ...inactiveSize };

    return (
        <>
            <motion.div
                style={{
                    position: "absolute",
                    width: active ? activeSize.width : inactiveSize.width,
                    height: active ? activeSize.height : inactiveSize.height,
                    zIndex,
                    border: active || offset < 0 ? `2px solid ${color}` : `0px`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "width .3s, height .3s",
                    borderRadius: 16,
                    overflow: "hidden",
                }}
                animate={{
                    ...animationProps,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
                onClick={clickedIndex}
                onHoverStart={() => onHover(active && true)}
                onHoverEnd={() => onHover(false)}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {!loaded && (
                        <Typography
                            as="p"
                            sx={{ color, position: "absolute", p: 2 }}
                        >
                            Loading...
                        </Typography>
                    )}

                    {loaded === "error" ? (
                        <Typography
                            as="p"
                            sx={{ color, position: "absolute", p: 2 }}
                        >
                            Image not found
                        </Typography>
                    ) : (
                        <>
                            <motion.img
                                src={item.image_url}
                                alt={`${item.artist_full_name} - ${item.artwork_name}`}
                                style={{
                                    width: active ? "100%" : "auto",
                                    height: active ? "100%" : "auto",
                                    objectFit: "contain",
                                    opacity: 1 - Math.abs(offset) * 0.2,
                                    display: loaded ? "block" : "none",
                                    visibility:
                                        loaded == "error"
                                            ? "hidden"
                                            : "visible",
                                }}
                                onLoad={(e) => {
                                    setLoaded(true);
                                    setNaturalSize({
                                        w: e.target.naturalWidth,
                                        h: e.target.naturalHeight,
                                    });
                                }}
                                onError={() => setLoaded("error")}
                            />
                            {item?.mask && active && (
                                <>
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: `${
                                                item.mask.centroid[1] * 100
                                            }%`,
                                            left: `${
                                                item.mask.centroid[0] * 100
                                            }%`,
                                            transform: "translate(-50%, -50%)",
                                            width: `${
                                                (item.mask.width * 100) /
                                                naturalSize.w
                                            }%`,
                                            height: `${
                                                (item.mask.height * 100) /
                                                naturalSize.h
                                            }%`,
                                            border: `1px solid ${color}`,
                                            zIndex: 1000,
                                        }}
                                    ></div>
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: `${
                                                item.mask.centroid[1] * 100
                                            }%`,
                                            left: `${
                                                item.mask.centroid[0] * 100
                                            }%`,
                                            transform: "translate(-50%, -50%)",
                                            width: "5px",
                                            height: "5px",
                                            borderRadius: "100%",
                                            border: `3px solid ${color}`,
                                            zIndex: 1000,
                                            backgroundColor: color,
                                        }}
                                    ></div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
}

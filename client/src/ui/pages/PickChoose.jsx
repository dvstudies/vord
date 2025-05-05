import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useRef, useCallback } from "react";
import {
    Box,
    Typography,
    ImageList,
    ImageListItem,
    IconButton,
} from "@mui/material";

import { getBackend, postBackend } from "../../utils.js";

import Viewport from "../components/Viewport.jsx";
import InputPanel from "../components/InputPanel.jsx";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useStore } from "../../store/useStore";

export default function PickChoose({
    color = "blue",
    config,
    schema,
    metadata,
    call,
}) {
    const theme = useTheme();
    const ratio = "column";
    const clauses = useStore((state) => state.clauses);

    const [entry, setEntry] = useState(metadata.entry || null);
    const [filter, setFilter] = useState(metadata.filter || { ids: new Set() });
    const [data, setData] = useState(metadata.data || []);
    const increment = 100;
    const [visibleItemsCount, setVisibleItemsCount] = useState(
        metadata.visibleItemsCount || increment
    );

    const listRef = useRef(null);

    const handleToggleSelection = (index) => {
        const newSelection = new Set(filter?.ids);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            newSelection.add(index);
        }
        setFilter({ ids: newSelection });
        const selected = data.find((item) => item._id === index);
        setEntry(selected || null);
    };

    // Initial load
    useEffect(() => {
        if (entry !== null) return;
        postBackend(config.api, {
            index: config.componentIndex,
            size: visibleItemsCount,
            clauses: clauses,
        }).then((res) => {
            setData(res);
            setVisibleItemsCount((prev) => prev + increment);
        });
    }, [clauses]);

    // Infinite scroll
    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
        if (atBottom) {
            postBackend(config.api, {
                index: config.componentIndex,
                size: visibleItemsCount + increment,
                clauses: clauses,
            }).then((res) => {
                setData(res);
                setVisibleItemsCount((prev) => prev + increment);
            });
        }
    };

    useEffect(() => {
        const el = listRef.current;
        if (el) {
            el.addEventListener("scroll", handleScroll);
            return () => el.removeEventListener("scroll", handleScroll);
        }
    }, [visibleItemsCount, clauses]);

    useEffect(() => {
        metadata.data = data;
        metadata.filter = filter;
        metadata.entry = entry;
        metadata.visibleItemsCount = visibleItemsCount;
        metadata.clauses = clauses;
    }, [entry, data, filter, visibleItemsCount, clauses]);

    useEffect(() => {
        if (filter.ids && filter.ids.size > 0) {
            call.ids = Array.from(filter.ids);
            call.field = "_id";
            useStore.setState((state) => ({ activeCall: { ...call } }));
        }
    }, [filter]);

    const Input = () => (
        <InputPanel
            config={config}
            color={color}
            theme={theme}
            optionsOn={entry}
            mainChildren={null}
            secondaryChildren={<InfoTab entry={entry} />}
            fullHeight={entry !== null}
        />
    );

    const Canvas = useCallback(
        () => (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <ImageMagnifier
                    entry={entry}
                    color={color}
                />
                <Box
                    id="image-list"
                    ref={listRef}
                    sx={{
                        width: "30%",
                        overflowY: "auto",
                        pr: 2,
                        pt: 1,
                    }}
                >
                    <ImageList
                        variant="woven"
                        cols={3}
                        gap={8}
                    >
                        {data.map((item) => {
                            const index = item._id;
                            return (
                                <ImageListItem
                                    key={index}
                                    onClick={() => handleToggleSelection(index)}
                                    sx={{
                                        border: filter?.ids.has(index)
                                            ? "2px solid"
                                            : "none",
                                        borderColor: color,
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        backgroundColor: "white",
                                        cursor: "pointer",
                                    }}
                                >
                                    <img
                                        src={`${item.image_url}?w=161&fit=crop&auto=format`}
                                        alt={item.artwork_name}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </Box>
            </Box>
        ),
        [data, filter, entry]
    );

    return (
        <Viewport
            layout={{ ratio: ratio, color: color }}
            input={<Input />}
            canvas={<Canvas />}
        />
    );
}

function ImageMagnifier({ entry, color = "blue", width = 200, height = 200 }) {
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

function InfoTab({ entry }) {
    const info = useStore((state) => state.info);
    const theme = useTheme();

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                color: theme.palette.white.main,
                px: 2,
                pb: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{ pb: 1 }}
            >
                {entry.artwork_name}
            </Typography>
            {entry && (
                <>
                    <Typography
                        variant="h5"
                        sx={{ pb: 0 }}
                    >
                        {entry.artist_full_name}
                    </Typography>

                    {info.slice(3).map((column, index) => (
                        <Typography
                            as="p"
                            key={index}
                        >
                            <br />
                            {column.replace("_", " ")}:<br />
                            {entry[column]}
                            <br />
                        </Typography>
                    ))}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            m: 4,
                            p: 1,
                            background: "#ebebeb",
                            borderRadius: "100%",
                        }}
                    >
                        <IconButton
                            aria-label="open"
                            href={entry.source_url}
                            target="_blank"
                        >
                            <OpenInNewIcon />
                        </IconButton>
                    </Box>
                </>
            )}
        </Box>
    );
}

import { Box, IconButton, Tooltip } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../../store/useStore.jsx";

import ActionButton from "../components/ActionButton.jsx";
import CollectionsIcon from "@mui/icons-material/StorageOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutline";

export default function Nav() {
    const theme = useTheme();
    const filtersHistory = useStore((state) => state.filtersHistory);
    const activeFilterId = useStore((state) => state.activeFilterId);
    const setActiveFilter = useStore((state) => state.setActiveFilter);

    const resetFilters = useStore((state) => state.resetFilters);

    const mainContainerRef = useRef(null);
    const shadowRef = useRef(null);

    useEffect(() => {
        const mainContainer = mainContainerRef.current;
        const shadow = shadowRef.current;

        const mainContainerRect = mainContainer.getBoundingClientRect();
        const w = mainContainerRect.width - theme.btnM / 2;

        shadow.style.width = `${w}px`;
        shadow.style.borderRadius = `${w / 2}px`;
        shadow.style.height = `${mainContainerRect.height}px`;
        shadow.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    }, []);

    function History({ filtersHistory }) {
        return filtersHistory.map((filter, i) => {
            if (!filter.btn.icon) return null; // Skip if no icon
            return (
                <Box
                    sx={{
                        ...theme.btnS,
                        bgcolor:
                            i != activeFilterId
                                ? "transparent"
                                : filter.btn.color,
                        borderColor: filter.btn.color,
                    }}
                    key={i}
                    className="holomorphic"
                >
                    <IconButton
                        sx={{
                            height: "100%",
                            width: "100%",
                            color:
                                i == activeFilterId
                                    ? "kinherit"
                                    : filter.btn.color,
                        }}
                        onClick={() => setActiveFilter(i)}
                    >
                        {filter.btn.icon}
                    </IconButton>
                </Box>
            );
        });
    }

    return (
        <>
            <Box
                ref={mainContainerRef}
                sx={{
                    width: `${theme.brnH}px`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <DatabaseButton />
                <ActionButton />
                <History filtersHistory={filtersHistory} />
                <Box
                    ref={shadowRef}
                    sx={{
                        border: `solid 1px #ebebeb${theme.palette.white.darker}`,
                        position: "absolute",
                        top: 0,
                        zIndex: -2,
                        // bgcolor: "transparent",
                    }}
                ></Box>
                <Box sx={{ marginTop: "auto" }}>
                    <Box
                        sx={{
                            ...theme.btnS,
                        }}
                        className="holomorphic"
                    >
                        <IconButton
                            sx={{ height: "100%", width: "100%" }}
                            onClick={resetFilters}
                        >
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

function DatabaseButton({}) {
    const theme = useTheme();
    const dbOn = useStore((state) => state.dbOn);

    const dbShow = () => {
        useStore.setState({ dbOn: !dbOn });
    };

    return (
        <Box
            sx={{
                ...theme.btnS,
            }}
            className="holomorphic"
        >
            <IconButton
                sx={{ height: "100%", width: "100%" }}
                onClick={dbShow}
            >
                <CollectionsIcon />
            </IconButton>
        </Box>
    );
}

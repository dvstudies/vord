import { Box, IconButton, Tooltip } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useStore } from "../../store/useStore.jsx";

import AddIcon from "@mui/icons-material/Add";

export default function ActionButton() {
    const theme = useTheme();
    const addBtn = useStore((state) => state.addBtn);
    const addFilter = useStore((state) => state.addFilter);
    const actionBtns = useStore((state) => state.actionBtns);

    const [showSubActions, setShowSubActions] = useState(null);
    const [showCategories, setShowCategories] = useState(false);

    const actionButtonRef = useRef(null);

    const showBtns = () => {
        setShowCategories(!showCategories);
        setShowSubActions(null);
    };

    const showSubBtns = (id) => {
        setShowSubActions(id);
    };

    // Trigger a blur effect on the canvas
    useEffect(() => {
        if (showCategories) {
            useStore.setState({ actionBtnFocus: true });
        } else {
            useStore.setState({ actionBtnFocus: false });
        }
    }, [showCategories]);

    // // Mouse out event - conflicting with toggle
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (
    //             actionButtonRef.current &&
    //             !actionButtonRef.current.contains(event.target)
    //         ) {
    //             setShowCategories(false);
    //             setShowSubActions(null);
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [actionButtonRef]);

    return (
        <>
            <Box
                sx={{
                    ...theme.btnS,
                }}
                className="holomorphic"
            >
                <IconButton
                    sx={{ height: "100%", width: "100%" }}
                    onClick={showBtns}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {showCategories && (
                <Box
                    ref={actionButtonRef}
                    sx={{
                        position: "absolute",
                        zIndex: 10,
                        top: 0,
                        left: `${theme.btnH + theme.btnM * 3 + 2}px`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        // bgcolor: "rgba(100,100,100, 0.1)",
                        borderRadius: `${theme.btnH / 2}px`,
                    }}
                    className="subBtn"
                >
                    {actionBtns.btns.map((cat, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}
                        >
                            <Box
                                sx={{
                                    ...theme.btnS,
                                    bgcolor: cat.color,
                                    borderColor: cat.color,
                                }}
                            >
                                <Tooltip
                                    title={cat.name}
                                    placement="bottom"
                                    slotProps={{
                                        popper: {
                                            sx: {
                                                "& .MuiTooltip-tooltip": {
                                                    backgroundColor: cat.color,
                                                    borderRadius: "20px",
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                        }}
                                        onClick={(e, id = i) => showSubBtns(id)}
                                    >
                                        {cat.icon}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {showSubActions == i && (
                                <>
                                    {cat.btns.map((subBtn, j) => (
                                        <Box
                                            key={j}
                                            sx={{
                                                ...theme.btnS,
                                                borderColor: subBtn.dev // --------------------------------------- temp for dev mode
                                                    ? cat.color
                                                    : "none",
                                                opacity: subBtn.dev // --------------------------------------- temp for dev mode
                                                    ? 1
                                                    : 0.3,
                                            }}
                                        >
                                            <Tooltip
                                                title={subBtn.name}
                                                placement="bottom"
                                                slotProps={{
                                                    popper: {
                                                        sx: {
                                                            "& .MuiTooltip-tooltip":
                                                                {
                                                                    backgroundColor:
                                                                        cat.color,
                                                                    borderRadius:
                                                                        "20px",
                                                                },
                                                        },
                                                    },
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{
                                                            height: "100%",
                                                            width: "100%",
                                                            color: cat.color,
                                                        }}
                                                        disabled={!subBtn.dev} // ------------------------------------ temp for dev mode
                                                        onClick={(
                                                            e,
                                                            btn = subBtn
                                                        ) => {
                                                            // addBtn(btn);
                                                            addFilter(btn);
                                                            showBtns();
                                                        }}
                                                    >
                                                        {subBtn.icon}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </>
    );
}

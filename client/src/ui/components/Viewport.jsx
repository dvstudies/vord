import { useRef, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../../store/useStore";
import { opacifyColor } from "../../utils.js";

import About from "../pages/About.jsx";

export default function Viewport({ layout, input, canvas }) {
    const theme = useTheme();
    const actionBtnFocus = useStore((state) => state.actionBtnFocus);
    const filtersHistory = useStore((state) => state.filtersHistory);
    const mainViewRef = useRef(null);
    const modalOn = useStore((state) => state.modalOn);

    const ratios = {
        column: {
            inputW: "auto",
            canvasW: "75%",
        },
        square: {
            inputW: "auto",
            canvasW: theme.viewportS.height,
        },
    };

    useEffect(() => {
        if (mainViewRef.current) {
            useStore.setState({
                mainViewProperties: {
                    width: mainViewRef.current.offsetWidth - theme.btnM * 7,
                    height: mainViewRef.current.offsetHeight - theme.btnM * 7,
                    top: mainViewRef.current.offsetTop,
                    left: mainViewRef.current.offsetLeft,
                },
            });
        }
    }, [mainViewRef]);

    return (
        <Box
            ref={mainViewRef}
            sx={{
                ...theme.viewportS,

                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                border: `solid 0.1px ${theme.palette.white.darker}`,

                borderRadius: theme.brdRad,
                backgroundImage: "linear-gradient(45deg, #000000, #222222)",
                backgroundSize: "400% 400%",

                overflow: "hidden",
                position: "relative",
            }}
            // className="holomorphic"
        >
            <ModalLayered
                zIndex={9}
                bool={modalOn}
                blur={100}
            />
            <ModalLayered
                zIndex={100}
                bool={actionBtnFocus}
            />

            {/* viewport content */}
            <Box
                sx={{
                    maxHeight: `calc(100% - ${theme.btnM * 8}px)`,
                    m: !layout ? "none" : `${theme.btnM * 2}px`,
                    flex: 1,
                    py: !layout ? "none" : `${theme.btnM * 2}px`,
                    px: !layout ? "none" : `${theme.btnM * 2}px`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: `${theme.btnM * 2}px`,
                    borderRadius: theme.brdRad,
                    border: !layout ? "none" : `solid 1px ${layout.color}`,

                    backgroundColor: !layout
                        ? "none"
                        : opacifyColor(layout.color, 0.4),

                    backdropFilter: "blur(5px)",
                    zIndex: 2,
                }}
            >
                {input}
            </Box>
            <Box
                id="canvas-column"
                sx={{
                    width: !layout ? "100%" : ratios[layout.ratio].canvasW,
                    height: "100%",
                    // backgroundColor: "#ffffff",

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                }}
            >
                {canvas}
            </Box>
        </Box>
    );
}

function ModalLayered({ zIndex, bool, timeDuration = 0.3, blur = 10 }) {
    return (
        <Box
            sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: bool ? 1 : 0,
                backdropFilter: bool ? `blur(${blur}px)` : "blur(0px)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                // ? "rgba(0, 0, 0, 0.2)"
                // : "rgba(10,10,10, 0.2)",
                zIndex: zIndex,
                pointerEvents: bool ? "auto" : "none",
                transition: `all ${timeDuration}s ease-out`,
            }}
            onClick={() => useStore.setState({ actionBtnFocus: false })}
        ></Box>
    );
}

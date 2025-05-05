import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../../store/useStore";
import { opacifyColor } from "../../utils.js";

export default function Viewport({ layout, input, canvas }) {
    const theme = useTheme();
    const actionBtnFocus = useStore((state) => state.actionBtnFocus);

    const timeDuration = 0.3;

    const fadeS = {
        opacity: actionBtnFocus ? 0 : 1,
        // filter: actionBtnFocus ? "blur(2px)" : "blur(0)",
        // boxShadow: actionBtnFocus ? "none" : "inherit",
        transition: `all ${timeDuration}s ease-out`,
    };

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

    return (
        <Box
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
            {/* white modal for transition */}
            <Box
                sx={{
                    position: "absolute",
                    width: "1000vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",

                    opacity: !actionBtnFocus ? 0 : 1,
                    backdropFilter: !actionBtnFocus
                        ? "blur(0px)"
                        : "blur(10px)",
                    transition: `all ${timeDuration}s ease-out`,
                    zIndex: 1,
                    pointerEvents: !actionBtnFocus ? "none" : "auto",
                }}
            ></Box>

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
                }}
            >
                {canvas}
            </Box>
        </Box>
    );
}

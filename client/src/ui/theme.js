import { createTheme } from "@mui/material/styles";

const btnH = 0.05 * window.innerHeight;
const btnM = btnH * 0.2;
const mainContainerPadding = 21;

console.log(
    "h",
    window.innerHeight,
    "bnrH",
    btnH + btnM * 2,
    "viewportH",
    window.innerHeight - 2 * (btnH + btnM * 2) - mainContainerPadding * 2,
    "padding",
    mainContainerPadding
);

// Main dims and colors
let theme = createTheme({
    fontFamily: "Work Sans",
    mainContainerPadding: `${mainContainerPadding}px`,
    btnH,
    btnM,
    brdRad: `${btnH / 2}px`,
    typography: {
        fontFamily: "Work Sans",
    },
    palette: {
        primary: {
            main: "#1e88e5",
        },
        secondary: {
            main: "#e91e63",
        },
        success: {
            main: "#4caf50",
        },
        warning: {
            main: "#ff9800",
        },
        error: {
            main: "#f44336",
        },
        background: {
            main: "#f5f5f5",
        },
        // text: {
        //     main: "#212121",
        // },
        white: {
            light: "#ffffff",
            main: "#f5f5f5",
            darker: "#ebebeb",
        },
        black: {
            light: "#000000",
            main: "#212121",
            darker: "#000000",
        },
        grey: {
            light: "#f5f5f5",
            main: "#bdbdbd",
            darker: "#757575",
        },
        extra: {
            inspect: "#F8AC4F",
            interpret: "#5EBDFF",
            analyze: "#E943A4",
        },
    },
});

// Components
theme = createTheme(theme, {
    bnrH: btnH + btnM * 2,
    viewportS: {
        width: `${
            window.innerWidth - btnH - mainContainerPadding - btnM * 6
        }px`,
        height: `${
            window.innerHeight -
            2 * (btnH + btnM * 2) -
            mainContainerPadding * 2
        }px`,
        ml: `${btnM}px`,
    },
    btnS: {
        width: `${theme.btnH}px`,
        height: `${theme.btnH}px`,
        borderRadius: theme.brdRad,
        backgroundColor: theme.palette.white.main,
        border: `solid 1px ${theme.palette.white.darker}`,
        margin: `${theme.btnM}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    btnTxtS: {
        width: `auto`,
        paddingLeft: `${theme.btnM * 2}px`,
        paddingRight: `${theme.btnM * 2}px`,
    },
    tooltipS: {
        fontSize: "0.8rem",
        p: 2,
        borderRadius: theme.brdRad,
        color: theme.palette.white.main,
    },
    chartS: {
        backgroundColor: "transparent",
        tickFontSize: 30,
        tickFill: theme.palette.white.main,
        margin: {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100,
        },
        axis: {
            stroke: theme.palette.grey.darker,
            strokeWidth: 2,
        },
        axisTickLabelProps: {
            // fill: theme.palette.white.main,
            stroke: theme.palette.grey.darker,
            strokeWidth: 1,
            fontSize: 15,
            fontFamily: theme.fontFamily,
            textAnchor: "middle",
        },
        gridLineStyle: {
            stroke: theme.palette.grey.darker,
            strokeWidth: 1,
            strokeDasharray: "2,5",
        },
        line: {
            stroke: theme.palette.white.main,
            strokeWidth: 5,
        },
    },
});

export default theme;

import { useState } from "react";
import { Box } from "@mui/material";

export default function ToggleButton({
    label = "",
    color,
    theme,
    onToggle,
    initial = false,
    exclusive = false,
}) {
    const [active, setActive] = useState(initial);

    const handleClick = () => {
        const newState = !active;
        setActive(newState);
        onToggle?.(newState);
    };

    return (
        <Box
            onClick={!(exclusive && active) ? handleClick : undefined}
            sx={{
                cursor: "pointer",
                px: 2,
                py: 1,
                width: "fit-content",
                borderRadius: theme.brdRad,
                backgroundColor: active ? color : "transparent",
                color: active ? theme.palette.white.main : color,
                fontFamily: theme.fontFamily,
                fontSize: "0.875rem",
                fontWeight: 500,
                border: `1px solid ${color}`,
                userSelect: "none",
                transition: "all 0.2s ease",
                // "&:hover": {
                //     backgroundColor: active
                //         ? color
                //         : theme.palette.white.light ?? theme.palette.grey[100],
                // },
            }}
        >
            {label}
        </Box>
    );
}

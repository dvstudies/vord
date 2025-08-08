import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TooltipCard({
    vals = {},
    color,
    image = null,
    onToolipClick,
    legend = true,
}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: color,
                color: theme.palette.white.main,
                p: 2,
                borderRadius: 1,
                ...theme.tooltipS,
                display: "flex",
                flexDirection: "column",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                boxShadow: 3,
                fontFamily: theme.typography.fontFamily,
                maxWidth: 300,
                maxHeight: 400,
                overflowY: "auto",

                pointerEvents: "auto",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (onToolipClick) {
                    onToolipClick();
                }
            }}
        >
            {image && (
                <Box
                    component="img"
                    src={image}
                    alt="Tooltip Image"
                    sx={{
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: 200,
                        borderRadius: 1,
                        mb: legend ? 1 : 0,
                    }}
                />
            )}
            {legend &&
                Object.entries(vals).map(([key, value]) => (
                    <div key={key}>
                        <strong>{key.replaceAll("_", " ")}:</strong> {value}
                    </div>
                ))}
        </Box>
    );
}

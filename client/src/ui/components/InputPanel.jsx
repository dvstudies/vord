import { Box, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/HelpOutline";

export default function InputPanel({
    config,
    theme,
    color,
    optionsOn,
    mainChildren,
    secondaryChildren,
}) {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ color }}
                >
                    {config?.name}
                </Typography>
                <Tooltip
                    title={config?.info}
                    placement="bottom"
                    slotProps={{
                        popper: {
                            sx: {
                                "& .MuiTooltip-tooltip": {
                                    backgroundColor: color,
                                    ...theme?.tooltipS,
                                    boxShadow: 3,
                                },
                            },
                        },
                    }}
                >
                    <InfoIcon sx={{ color, cursor: "pointer" }} />
                </Tooltip>
            </Box>
            {mainChildren}
            {optionsOn && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                    }}
                >
                    <hr
                        style={{
                            width: "100%",
                            borderColor: color,
                            borderWidth: "0.5px",
                            borderStyle: "solid",
                        }}
                    />
                    {secondaryChildren}
                </Box>
            )}
        </>
    );
}

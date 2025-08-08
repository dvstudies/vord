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
    const formatTitle = (title) => {
        if (title?.length > 10) {
            const capitalLetters = title.match(/[A-Z]/g);
            if (capitalLetters?.length >= 2) {
                const secondCapitalIndex =
                    title.slice(1).indexOf(capitalLetters[1]) + 1;
                return (
                    <>
                        {title.slice(0, secondCapitalIndex)}
                        <br />
                        {title.slice(secondCapitalIndex)}
                    </>
                );
            }
        }
        return title;
    };

    // const titleFormatted = formatTitle(config?.name);
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    zIndex: 1000,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ color }}
                >
                    {formatTitle(config?.name)}
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
            {optionsOn && secondaryChildren && (
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

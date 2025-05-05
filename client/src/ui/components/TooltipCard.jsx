import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { xAccessor, yAccessor } from "../../utils.js";
import { Tooltip } from "@visx/xychart";
import { shadows } from "@mui/system";

export default function TooltipCard({ color }) {
    const theme = useTheme();

    return (
        <Tooltip
            showVerticalCrosshair
            snapTooltipToDatumX
            snapTooltipToDatumY
            showDatumGlyph
            glyphStyle={{
                fill: color,
                stroke: theme.palette.white.main,
                strokeWidth: 1.5,
            }}
            renderTooltip={({ tooltipData }) => {
                const datum = tooltipData?.nearestDatum?.datum;
                return datum ? (
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
                        }}
                    >
                        {Object.entries(datum).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                    </Box>
                ) : null;
            }}
        />
    );
}

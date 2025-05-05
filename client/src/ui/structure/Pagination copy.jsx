import { Box, Tooltip, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useStore } from "../../store/useStore";

import CircleIcon from "@mui/icons-material/Circle";

export default function Pagination() {
    const theme = useTheme();
    const filtersHistory = useStore((state) => state.filtersHistory);

    // const actionId = useStore((state) => state.actionActive);
    // const dataPre = useStore(
    //     (state) => state.dataHistory[actionId - 1] || state.data || []
    // );
    // const dataPost = useStore((state) => state.dataHistory[actionId] || []);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            // width="100%"
            height="100px"
            bgcolor="lightgray"
            px={2}
        >
            {/* Spacer Box to push the center Box */}
            <Box width="33%" />

            {/* Centered Box */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="33%"
            >
                <Box
                    bgcolor="blue"
                    color="white"
                    px={2}
                    py={1}
                    sx={{ width: "100%" }}
                >
                    Centered Box
                </Box>
            </Box>

            {/* Right-end Box */}
            <Box
                width="33%"
                display="flex"
                justifyContent="flex-end"
            >
                <Box
                    bgcolor="green"
                    color="white"
                    px={2}
                    py={1}
                >
                    Right Box
                </Box>
            </Box>
        </Box>
    );
}

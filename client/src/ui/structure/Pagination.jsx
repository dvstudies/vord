import { Box, Tooltip, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useStore } from "../../store/useStore";

import CircleIcon from "@mui/icons-material/Circle";

export default function Pagination() {
    const theme = useTheme();
    const filtersHistory = useStore((state) => state.filtersHistory);
    const activeCall = useStore((state) => state.activeCall);
    const clauses = useStore((state) => state.clauses);
    const runFilterCall = useStore((state) => state.runFilterCall);

    const activeFilterId = useStore((state) => state.activeFilterId);

    // const [sample, setSample] = useState({
    //     in: null,
    //     out: null,
    // });

    const [sampleIn, setIn] = useState("...");
    const [sampleOut, setOut] = useState("...");

    useEffect(() => {
        runFilterCall().then((res) => {
            console.log(res.count);
            setIn(res.count);
        });
    }, [clauses, activeFilterId]);

    useEffect(() => {
        console.log("activeclass da pagination", activeCall);
        if (!activeCall) setOut("...");
        runFilterCall(activeCall).then((res) => {
            console.log("filtered", res.count);
            setOut(res.count);
        });
    }, [activeCall, activeFilterId]);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            // width="100%"
            height="100px"
            px={2}
        >
            <Box width="25%" />
            <Box
                width="50%"
                sx={{
                    height: `${theme.bnrH}px`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        ...theme.btnS,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        bgcolor: "transparent",
                        borderWidth: "1px",
                        // border: "none",
                    }}
                >
                    {filtersHistory.map(
                        (filter, i) =>
                            filter.btn.color && (
                                <Tooltip
                                    key={i}
                                    title={filter.btn.name}
                                    placement="top"
                                >
                                    <Box
                                        key={i}
                                        sx={{
                                            height: "100%",
                                            // width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            margin: "0px 20px",
                                        }}
                                    >
                                        <CircleIcon
                                            sx={{
                                                fontSize: "10px",
                                                color: filter.btn.color,
                                            }}
                                        />
                                    </Box>
                                </Tooltip>
                            )
                    )}
                </Box>
            </Box>
            <Box
                width="25%"
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Chip
                    label={`filtering ${sampleOut} entries from ${sampleIn}`}
                />
            </Box>
        </Box>
    );
}

import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Tooltip, Stack } from "@mui/material";
import tinycolor from "tinycolor2";

import { postBackend } from "../../utils.js";
import { useStore } from "../../store/useStore";

import Viewport from "../components/Viewport.jsx";
import InputPanel from "../components/InputPanel.jsx";
import DropdownMenu from "../components/DropdownMenu.jsx";
import FilterInput from "../components/FilterInput.jsx";
import ColorChart from "../components/ColorChart.jsx";

export default function ColorWheel({ color, config, schema, metadata, call }) {
    const theme = useTheme();
    const ratio = "column"; // or "square"
    const clauses = useStore((state) => state.clauses);

    const [selected, setSelected] = useState(metadata.selected || "hue");
    const [order, setOrder] = useState(metadata.order || "lightness");
    const [filter, setFilter] = useState(metadata.filter || [0, 360]);
    const [domainL, setDomainL] = useState(metadata.domainL || [0, 1]);
    const [domainS, setDomainS] = useState(metadata.domainS || [0, 1]);
    const [temporaryIdsHolder, setTemporaryIdsHolder] = useState(
        metadata.temporaryIdsHolder || { ids: [] }
    );
    const [data, setData] = useState(metadata.data || []);
    const [processedData, setProcessedData] = useState(
        metadata.processedData || []
    );

    const columns = ["saturation", "lightness"];

    const options = columns.map((label) => ({
        label: label,
        value: label,
    }));

    function resetClause() {
        call = { type: call.type };
    }

    useEffect(() => {
        if (selected == "" || !selected || selected == metadata.selected)
            return;

        // Reset filter when column changes
        // setFilter([0, 360]);
        resetClause();

        postBackend(config.api, {
            index: config.componentIndex,
            column: selected,
            // size: 4000,
            clauses: clauses,
        }).then((res) => {
            setData(res);
        });
    }, [selected]);

    // MOVE THIS STUFF TO THE BACKEND
    useEffect(() => {
        if (data.length === 0) return;

        const processedData = data.map((d) => {
            const hex = d.dominant_color;
            const hsl = tinycolor(hex).toHsl();
            return {
                ...d,
                hue: hsl.h,
                saturation: hsl.s,
                lightness: hsl.l,
            };
        });

        processedData.sort((a, b) => a[order] - b[order]);

        metadata.processedData = processedData;
        metadata.order = order;
        setProcessedData(processedData);
    }, [data, order]);

    // useEffect(() => {
    //     if (filter.min !== "" && filter.max !== "") {
    //         call.min = filter.min;
    //         call.max = filter.max;
    //         call.field = selected;

    //         useStore.setState((state) => ({ activeCall: { ...call } }));
    //     }
    // }, [filter]);

    useEffect(() => {
        metadata.data = data;
        metadata.filter = filter;
        metadata.selected = selected;
        metadata.clauses = clauses;
        metadata.temporaryIdsHolder = temporaryIdsHolder;
    }, [selected, data, filter, clauses, temporaryIdsHolder]);

    useEffect(() => {
        metadata.domainL = domainL;
        metadata.domainS = domainS;
    }, [domainL, domainS]);

    useEffect(() => {
        console.log("trigger action on domainS", domainS);
    }, [domainS]);

    useEffect(() => {
        if (temporaryIdsHolder?.ids.length > 0) {
            call.field = "_id";
            call.ids = temporaryIdsHolder.ids;
            useStore.setState({ activeCall: { ...call } });
        }
    }, [temporaryIdsHolder]);

    const handleBrushEnd = useCallback((e) => {
        if (e.ids.length === 0) return;
        setFilter(e.range);
        setTemporaryIdsHolder({ ids: e.ids });
    }, []);

    const Input = () => (
        <>
            <InputPanel
                config={config}
                color={color}
                theme={theme}
                optionsOn={selected}
                mainChildren={
                    <DropdownMenu
                        label="Choose an option"
                        color={color}
                        options={options}
                        value={order}
                        // onChange={(e) => setSelected(e.target.value)}
                        onChange={(e) => setOrder(e.target.value)}
                    />
                }
                secondaryChildren={
                    <>
                        <Typography
                            as="p"
                            sx={{ pb: 0, color: color }}
                        >
                            Hue
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mb: 1 }}
                        >
                            <FilterInput
                                label={"min"}
                                value={filter[0]}
                                onSubmit={(val) => setFilter([val, filter[1]])}
                                color={color}
                                theme={theme}
                            />
                            <FilterInput
                                label={"max"}
                                value={filter[1]}
                                onSubmit={(val) => setFilter([filter[0], val])}
                                color={color}
                                theme={theme}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                mb: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                as="p"
                                sx={{ pb: 0, color: color, width: "50%" }}
                            >
                                Lightness
                            </Typography>
                            <FilterInput
                                label={"0"}
                                value={domainL[0]}
                                onSubmit={(val) =>
                                    setDomainL([Number(val), domainL[1]])
                                }
                                color={color}
                                theme={theme}
                            />
                            <FilterInput
                                label={"1"}
                                value={domainL[1]}
                                onSubmit={(val) =>
                                    setDomainL([domainL[0], Number(val)])
                                }
                                color={color}
                                theme={theme}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                mb: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                as="p"
                                sx={{ pb: 0, color: color, width: "50%" }}
                            >
                                Saturation
                            </Typography>
                            <FilterInput
                                label={"0"}
                                value={domainS[0]}
                                onSubmit={(val) =>
                                    setDomainS([Number(val), domainS[1]])
                                }
                                color={color}
                                theme={theme}
                            />
                            <FilterInput
                                label={"1"}
                                value={domainS[1]}
                                onSubmit={(val) =>
                                    setDomainS([domainS[0], Number(val)])
                                }
                                color={color}
                                theme={theme}
                            />
                        </Stack>
                    </>
                }
            />
        </>
    );

    const Canvas = useCallback(
        () => (
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                <ColorChart
                    data={processedData}
                    color={color}
                    onFilter={handleBrushEnd}
                    domainS={domainS}
                    domainL={domainL}
                    initialBrushAngles={filter}
                />
            </Box>
        ),
        [processedData, color, domainS, domainL]
    );
    return (
        <>
            <Viewport
                layout={{ ratio: ratio, color: color }}
                input={<Input />}
                canvas={<Canvas />}
            />
        </>
    );
}

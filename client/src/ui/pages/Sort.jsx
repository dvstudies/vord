import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { shadows } from "@mui/system";

import { postBackend } from "../../utils.js";
import { useStore } from "../../store/useStore";

import Viewport from "../components/Viewport.jsx";
import InputPanel from "../components/InputPanel.jsx";
import DropdownMenu from "../components/DropdownMenu.jsx";
import FilterInput from "../components/FilterInput.jsx";
import BrushedXYChart from "../components/BrushedXYChart.jsx";

export default function Sort({ color, config, schema, metadata, call }) {
    const theme = useTheme();
    const columns = useStore((state) => state.columns);
    const ratio = "column";
    const clauses = useStore((state) => state.clauses);

    const [selected, setSelected] = useState(metadata.selected || "");
    const [filter, setFilter] = useState(
        metadata.filter || { min: "", max: "" }
    );
    const [data, setData] = useState(metadata.data || []);

    const options = columns.linear[config.componentIndex].map((label) => ({
        label: label.replaceAll("_", " "),
        value: label,
    }));

    function resetClause() {
        call = { type: call.type };
    }

    useEffect(() => {
        if (selected == "" || !selected || selected == metadata.selected)
            return;

        // Reset filter when column changes
        setFilter({ min: "", max: "" });
        resetClause();

        const columnType = schema.mappings.properties[selected]?.type;

        postBackend(config.api, {
            index: config.componentIndex,
            column: selected,
            maxBins: 100,
            type: columnType,
            clauses: clauses,
        }).then((res) => {
            setData(res);
        });
    }, [selected]);

    useEffect(() => {
        if (filter.min !== "" && filter.max !== "") {
            call.min = filter.min;
            call.max = filter.max;
            call.field = selected;

            useStore.setState((state) => ({ activeCall: { ...call } }));
        }
    }, [filter]);

    useEffect(() => {
        metadata.data = data;
        metadata.filter = filter;
        metadata.selected = selected;
        metadata.clauses = clauses;
    }, [selected, data, filter]);

    const handleBrushEnd = useCallback((e) => {
        setFilter(
            e
                ? { min: Math.round(e.x0), max: Math.round(e.x1) }
                : { min: "", max: "" }
        );
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
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    />
                }
                secondaryChildren={
                    <>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mb: 1 }}
                        >
                            {Object.entries(filter).map(([key, value]) => (
                                <FilterInput
                                    key={key}
                                    label={key}
                                    value={value}
                                    onSubmit={(val) => {}}
                                    color={color}
                                    theme={theme}
                                />
                            ))}
                        </Stack>
                    </>
                }
            />
        </>
    );

    const Canvas = useCallback(
        () => (
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                <BrushedXYChart
                    data={data}
                    color={color}
                    onEnd={handleBrushEnd}
                    filter={filter}
                />
            </Box>
        ),
        [data, color]
    );

    return (
        <Viewport
            layout={{ ratio, color }}
            input={<Input />}
            canvas={<Canvas />}
        />
    );
}

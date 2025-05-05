import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Tooltip, Stack } from "@mui/material";

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
    const [filter, setFilter] = useState(
        metadata.filter || { min: "", max: "" }
    );
    const [data, setData] = useState(metadata.data || []);

    const columns = ["hue", "saturation", "brightness"];

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
        setFilter({ min: "", max: "" });
        resetClause();

        const columnType = schema.mappings.properties[selected]?.type;

        postBackend(config.api, {
            index: config.componentIndex,
            column: selected,
            // size: 4000,
            clauses: clauses,
        }).then((res) => {
            const converted = res.map((d) => {
                const hex = d.dominant_color;
                const hsl = tinycolor(hex).toHsl();
                return {
                    ...d,
                    hue: hsl.h,
                    saturation: hsl.s,
                    lightness: hsl.l,
                };
            });

            console.log("converted data with hue:", converted);
            setData(converted);
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
                        // onChange={(e) => setSelected(e.target.value)}
                        onChange={(e) => setSelected("hue")} /// FORCE ONLY HUE DEV
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
            <Box
                sx={{ width: "100%", height: "100%", position: "relative" }}
            ></Box>
        ),
        [data, color]
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

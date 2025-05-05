import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { postBackend, opacifyColor, remapNumber } from "../../utils.js";

import Viewport from "../components/Viewport.jsx";
import InputPanel from "../components/InputPanel.jsx";
import DropdownMenu from "../components/DropdownMenu.jsx";
import FilterInput from "../components/FilterInput.jsx";
import ToggleButton from "../components/ToggleButton.jsx";
import TreemapChart from "../components/TreemapChart.jsx";

import { useStore } from "../../store/useStore";

export default function MetaSearch({ color, config, schema, metadata, call }) {
    const theme = useTheme();
    const columns = useStore((state) => state.columns);
    const ratio = "column"; // or "square"
    const clauses = useStore((state) => state.clauses);

    const [selected, setSelected] = useState(metadata.selected || "");
    const [filter, setFilter] = useState(metadata.filter || { cats: [] });
    const [data, setData] = useState(metadata.data || []);

    const options = columns.categorical[config.componentIndex].map((label) => ({
        label: label.replaceAll("_", " "),
        value: label,
    }));

    function resetClause() {
        call = { type: call.type };
    }

    useEffect(() => {
        if (selected == "" || !selected || selected == metadata.selected)
            return;

        setFilter({ cats: [] });
        resetClause();

        const columnType = schema.mappings.properties[selected]?.type;

        postBackend(config.api, {
            index: config.componentIndex,
            column: selected,
            maxCats: 100,
            type: columnType,
            clauses: clauses,
        }).then((res) => {
            const distribution = res.distribution;
            const min = distribution.reduce(
                (acc, curr) => Math.min(acc, curr.count),
                Infinity
            );
            const max = distribution.reduce(
                (acc, curr) => Math.max(acc, curr.count),
                -Infinity
            );

            distribution.forEach((d) => {
                d.color = opacifyColor(
                    color,
                    remapNumber(d.count, [min, max], [0.2, 1])
                );
            });

            setFilter({
                cats: distribution.map((d) => d.label),
            });

            setData({ ...res, distribution });
        });
    }, [selected]);

    // Inject filter into backend call
    useEffect(() => {
        if (filter.cats.length > 0 && selected) {
            call.cats = filter.cats;
            call.field = selected;
            useStore.setState((state) => ({ activeCall: call }));
        }
    }, [filter, selected]);

    // Persist in metadata
    useEffect(() => {
        metadata.data = data;
        metadata.filter = filter;
        metadata.selected = selected;
        metadata.clauses = clauses;
    }, [selected, data, filter]);

    const Input = () => (
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
                <Stack
                    flex={1}
                    direction="row"
                    spacing={2}
                    useFlexGap
                    sx={{
                        mb: 1,
                        flexWrap: "wrap",
                        height: "10vh",
                        maxHeight: "30vh",
                        position: "relative",
                        overflowY: "scroll",
                        overflowX: "hidden",
                    }}
                >
                    {data?.distribution?.map((d, i) => {
                        const isActive = filter.cats.includes(d.label);
                        return (
                            <ToggleButton
                                key={i}
                                label={d.label}
                                value={isActive}
                                onToggle={() => {
                                    setFilter((prev) => {
                                        const alreadyActive =
                                            prev.cats.includes(d.label);
                                        const updated = alreadyActive
                                            ? prev.cats.filter(
                                                  (l) => l !== d.label
                                              )
                                            : [...prev.cats, d.label];
                                        return { ...prev, cats: updated };
                                    });
                                }}
                                color={d.color}
                                theme={theme}
                                initial={isActive}
                            />
                        );
                    })}
                </Stack>
            }
        />
    );

    const Canvas = useCallback(
        () => (
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                {data?.distribution?.length > 0 && (
                    <TreemapChart
                        data={data}
                        filter={filter}
                        color={color}
                        onClick={(label) => {
                            setFilter((prev) => {
                                const alreadyActive = prev.cats.includes(label);
                                const updated = alreadyActive
                                    ? prev.cats.filter((l) => l !== label)
                                    : [...prev.cats, label];
                                return { ...prev, cats: updated };
                            });
                        }}
                    />
                )}
            </Box>
        ),
        [data, color, filter]
    );

    return (
        <Viewport
            layout={{ ratio: ratio, color: color }}
            input={<Input />}
            canvas={<Canvas />}
        />
    );
}

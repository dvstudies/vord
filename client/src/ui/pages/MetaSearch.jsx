import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Stack, Typography } from "@mui/material";
import {
    getBackend,
    postBackend,
    randomColorDistance,
    opacifyColor,
    remapNumber,
} from "../../utils.js";

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

        // Reset filter when column changes
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

            distribution.map((d, i) => {
                d.color = opacifyColor(
                    color,
                    remapNumber(d.count, [min, max], [0.2, 1])
                );

                d.active = true;
            });

            setFilter({
                cats: distribution.map((d) => d.label),
            });

            setData(res);
        });
    }, [selected]);

    useEffect(() => {
        if (data?.distribution?.length > 0) {
            const activeCats = data.distribution
                .filter((d) => d.active)
                .map((d) => d.label);

            call.cats = activeCats;
            call.field = selected;

            useStore.setState((state) => ({ activeCall: { ...call } }));
        }
    }, [data, filter]);

    useEffect(() => {
        metadata.data = data;
        metadata.filter = filter;
        metadata.selected = selected;
        metadata.clauses = clauses;
    }, [selected, data, filter]);

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
                        <Typography
                            as="p"
                            sx={{ pb: 0, color: color }}
                        >
                            Labels
                        </Typography>
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
                            {data?.distribution?.map((d, i) => (
                                <ToggleButton
                                    key={i}
                                    label={d.label}
                                    value={d.active}
                                    onToggle={(val) => {
                                        setData((prevData) => {
                                            if (
                                                prevData.distribution.filter(
                                                    (item) => item.active
                                                ).length === filter.cats.length
                                            ) {
                                                const updatedDistribution =
                                                    prevData.distribution.map(
                                                        (item, index) =>
                                                            index == i
                                                                ? {
                                                                      ...item,
                                                                      active: true,
                                                                  }
                                                                : {
                                                                      ...item,
                                                                      active: false,
                                                                  }
                                                    );
                                                return {
                                                    ...prevData,
                                                    distribution:
                                                        updatedDistribution,
                                                };
                                            } else {
                                                const updatedDistribution =
                                                    prevData.distribution.map(
                                                        (item, index) =>
                                                            index == i
                                                                ? {
                                                                      ...item,
                                                                      active: !item.active,
                                                                  }
                                                                : item
                                                    );
                                                if (
                                                    updatedDistribution.filter(
                                                        (item) => item.active
                                                    ).length === 0
                                                ) {
                                                    const resetDistribution =
                                                        prevData.distribution.map(
                                                            (item) => ({
                                                                ...item,
                                                                active: true,
                                                            })
                                                        );
                                                    return {
                                                        ...prevData,
                                                        distribution:
                                                            resetDistribution,
                                                    };
                                                } else {
                                                    return {
                                                        ...prevData,
                                                        distribution:
                                                            updatedDistribution,
                                                    };
                                                }
                                            }
                                        });

                                        // setData((prevData) => {
                                        //     const updatedDistribution =
                                        //         prevData.distribution.map(
                                        //             (item, index) =>
                                        //                 index === i
                                        //                     ? {
                                        //                           ...item,
                                        //                           active: val,
                                        //                       }
                                        //                     : item
                                        //         );
                                        //     return {
                                        //         ...prevData,
                                        //         distribution:
                                        //             updatedDistribution,
                                        //     };
                                        // });
                                    }}
                                    color={d.color}
                                    theme={theme}
                                    initial={d.active}
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
                {data?.distribution?.length > 0 && (
                    <TreemapChart
                        data={data}
                        color={color}
                        onClick={(label) => {
                            setData((prevData) => {
                                if (
                                    prevData.distribution.filter(
                                        (item) => item.active
                                    ).length === filter.cats.length
                                ) {
                                    const updatedDistribution =
                                        prevData.distribution.map((item) =>
                                            item.label === label
                                                ? { ...item, active: true }
                                                : { ...item, active: false }
                                        );
                                    return {
                                        ...prevData,
                                        distribution: updatedDistribution,
                                    };
                                } else {
                                    const updatedDistribution =
                                        prevData.distribution.map((item) =>
                                            item.label === label
                                                ? {
                                                      ...item,
                                                      active: !item.active,
                                                  }
                                                : item
                                        );
                                    if (
                                        updatedDistribution.filter(
                                            (item) => item.active
                                        ).length === 0
                                    ) {
                                        const resetDistribution =
                                            prevData.distribution.map(
                                                (item) => ({
                                                    ...item,
                                                    active: true,
                                                })
                                            );
                                        return {
                                            ...prevData,
                                            distribution: resetDistribution,
                                        };
                                    } else {
                                        return {
                                            ...prevData,
                                            distribution: updatedDistribution,
                                        };
                                    }
                                }
                            });
                        }}
                    />
                )}
            </Box>
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

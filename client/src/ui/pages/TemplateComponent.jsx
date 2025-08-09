import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { getBackend, postBackend } from "../../utils.js";

import Viewport from "../components/Viewport.jsx";
import InputPanel from "../components/InputPanel.jsx";

import { useStore } from "../../store/useStore";

export default function Name({ color, config, schema, metadata, call }) {
    const theme = useTheme();
    const ratio = "column"; // or "square"
    const clauses = useStore((state) => state.clauses);
    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState("");
    const [data, setData] = useState([]);

    function resetClause() {
        call = { type: call.type };
    }

    useEffect(() => {
        if (selected === "") return;
        setLoading(true);

        getBackend(config.api, {}).then((res) => {
            setData(res);
            setLoading(false);
        });
    }, [selected]);

    useEffect(() => {
        postBackend(config.api, { column: "test", blabla: "test" }).then(
            (res) => {
                console.log("post . res", res);
            }
        );
    }, [data]);

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
                loading={loading}
            />
        </>
    );
}

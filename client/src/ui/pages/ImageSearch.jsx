import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { Box, Icon, Stack, Typography } from "@mui/material";
import {
    postBackend,
    opacifyColor,
    remapNumber,
    getImageEmbeds,
} from "../../utils.js";

import Viewport from "../components/Viewport.jsx";
import InputPanel from "../components/InputPanel.jsx";
import ImgInputBox from "../components/ImgInputBox.jsx";
import FilterInput from "../components/FilterInput.jsx";
import ToggleButton from "../components/ToggleButton.jsx";

import Carousel from "../components/Carousel.jsx";

import { useStore } from "../../store/useStore";

import PaintingsIcon from "@mui/icons-material/Image";
import MasksIcon from "@mui/icons-material/CenterFocusStrong";

export default function ImageSearch({ color, config, schema, metadata, call }) {
    const theme = useTheme();
    const ratio = "column"; // or "square"
    const clauses = useStore((state) => state.clauses);

    const [imgInput, setImgInput] = useState(metadata.imgInput || null);
    const [OSIndex, setOSIndex] = useState(metadata.OSIndex || "paintings");
    const [filter, setFilter] = useState(
        metadata.filter || { index: 0, threshold: null, ids: [] }
    );
    const [data, setData] = useState(metadata.data || []);

    function resetClause() {
        call = { type: call.type };
    }

    useEffect(() => {
        // Check if input is valid and avoid recalculation
        const formatFlag = imgInput == null || !imgInput;

        const metaFlag =
            OSIndex == metadata.OSIndex &&
            data == metadata.data &&
            imgInput == metadata.imgInput;

        if (metaFlag || formatFlag) return;

        // Reset filter when column changes
        setFilter({ index: 0, threshold: null, ids: [] });
        resetClause();

        // Extract clip embeddings
        getImageEmbeds(imgInput.imageElement).then((embeddings) => {
            const imgEmbeds = Array.from(embeddings);
            if (imgEmbeds.length == 0) return;

            postBackend(config.api, {
                // index: config.componentIndex,
                index: OSIndex,
                embeddings: imgEmbeds,
                size: 100,
                clauses: clauses,
            }).then((res) => {
                setData(res);
            });
        });
    }, [imgInput, OSIndex]);

    useEffect(() => {
        if (filter.ids?.length > 0) {
            call.ids = filter.ids;
            call.field = "_id";
            useStore.setState((state) => ({ activeCall: { ...call } }));
        }
    }, [data, filter]);

    useEffect(() => {
        metadata.data = data;
        metadata.filter = filter;
        metadata.imgInput = imgInput;
        metadata.OSIndex = OSIndex;
        metadata.clauses = clauses;
    }, [imgInput, data, OSIndex, filter]);

    const toggleIndex = ["paintings", "masks"];

    const Input = () => (
        <>
            <InputPanel
                config={config}
                color={color}
                theme={theme}
                optionsOn={imgInput}
                mainChildren={
                    <>
                        <ImgInputBox
                            label={"Upload an image"}
                            value={imgInput?.dataUrl}
                            onCatch={setImgInput}
                            color={color}
                            theme={theme}
                        />
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                as="p"
                                sx={{ pb: 0, color: color, flexGrow: 1 }}
                            >
                                Search in:
                            </Typography>

                            {toggleIndex.map((lbl, i) => (
                                <ToggleButton
                                    key={i}
                                    label={lbl}
                                    value={lbl}
                                    color={color}
                                    theme={theme}
                                    initial={OSIndex === lbl}
                                    onToggle={(newState) => {
                                        if (newState) {
                                            setOSIndex(lbl);
                                        }
                                    }}
                                    exclusive={true}
                                />
                            ))}
                        </Stack>
                    </>
                }
                secondaryChildren={
                    <>
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
                                Index
                            </Typography>
                            <FilterInput
                                label={"0"}
                                value={filter.index}
                                onSubmit={(val) =>
                                    setFilter({
                                        ...filter,
                                        index: Number(val),
                                    })
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
                                Threshold
                            </Typography>
                            <FilterInput
                                label={"0"}
                                value={filter.threshold}
                                onSubmit={(val) =>
                                    setFilter({
                                        ...filter,
                                        threshold: Number(val),
                                    })
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
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "visible",
                }}
            >
                {data?.distribution?.length > 0 && (
                    <Carousel
                        data={data.distribution}
                        color={color}
                        index={filter.index}
                        onEnd={(e) => {
                            setFilter({
                                ...filter,
                                index: e,
                                ids: data.distribution
                                    .slice(0, e + 1)
                                    .map((d) => d._id),
                                threshold: data.distribution[e + 1]._score,
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

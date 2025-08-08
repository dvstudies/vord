import { Input, Box, Stack } from "@mui/material";
import { useState, useRef, useEffect } from "react";

import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import { opacifyColor } from "../../utils";

export default function ImgInputBox({
    label,
    value,
    onCatch,
    color,
    theme,
    InputAdornment,
}) {
    const [internalValue, setInternalValue] = useState(value || null);
    const fileInputRef = useRef(null);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            // reader.onload = () => setInternalValue(reader.result);
            reader.onload = () => {
                // const dataUrl = reader.result;
                // onCatch(dataUrl);

                const dataUrl = reader.result;

                const img = new Image();
                img.onload = () => {
                    onCatch({
                        file,
                        imageElement: img,
                        dataUrl: dataUrl,
                    });
                };
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        }
    };

    // useEffect(() => {
    //     console.log("ImgInputBox: internalValue", internalValue);
    //     onCatch(internalValue);
    // }, [internalValue]);

    return (
        <>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <Box
                onClick={handleBoxClick}
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: theme.brdRad,
                    backgroundColor: opacifyColor(color, 0.2),
                    border: `1px solid ${color}`,
                    cursor: "pointer",
                    overflow: "hidden",
                }}
            >
                {internalValue ? (
                    <img
                        src={internalValue}
                        alt="Uploaded"
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <AddPhotoIcon
                        sx={{
                            width: "20%",
                            height: "100%",
                            p: 5,
                            color,
                            borderRadius: theme.brdRad,
                        }}
                    />
                )}
            </Box>
        </>
    );
}

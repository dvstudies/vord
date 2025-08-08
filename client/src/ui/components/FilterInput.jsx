import { TextField } from "@mui/material";
import { useState } from "react";

export default function FilterInput({
    label,
    value,
    onSubmit,
    color,
    theme,
    InputAdornment,
}) {
    const [internalValue, setInternalValue] = useState(value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSubmit(internalValue);
        }
    };

    return (
        <TextField
            placeholder={label}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{
                width: "100%",
                borderRadius: theme.brdRad,
                color: color,
                // backgroundColor: theme.palette.white.darker,
                backgroundColor: color,

                input: {
                    // color: color,
                    color: theme.palette.white.darker,
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: color,
                        borderRadius: theme.brdRad,
                    },
                    "&:hover fieldset": {
                        borderColor: color,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: color,
                        borderWidth: 2,
                    },
                },
            }}
        />
    );
}

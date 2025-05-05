import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { opacifyColor } from "../../utils.js";

export default function DropdownMenu({
    label,
    color,
    options,
    value,
    onChange,
}) {
    const theme = useTheme();

    return (
        <Select
            value={value}
            onChange={onChange}
            displayEmpty
            sx={{
                borderRadius: theme.brdRad,
                width: "100%",
                color: color,
                "& .MuiSelect-icon": {
                    color: color, // dropdown arrow color
                },

                backgroundColor: theme.palette.white.darker,
            }}
            MenuProps={{
                PaperProps: {
                    sx: {
                        borderRadius: theme.brdRad,
                        pt: 0,
                        mt: 1,

                        backgroundColor: theme.palette.white.main,
                        "& .MuiMenuItem-root": {
                            border: `solid 1px transparent`,
                            borderRadius: theme.brdRad,
                            mx: 1,
                        },

                        "& .MuiMenuItem-root.Mui-selected": {
                            borderColor: color,
                            backgroundColor: opacifyColor(color, 0.1),
                        },
                        "& .MuiMenuItem-root:hover": {
                            backgroundColor: opacifyColor(color, 0.1),
                        },
                    },
                },
            }}
        >
            {options.map((option) => (
                <MenuItem
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
}

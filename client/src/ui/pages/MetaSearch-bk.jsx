import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Viewport from "../components/Viewport.jsx";

import { useStore } from "../../store/useStore.jsx";
import { use } from "react";

export default function MetaSearch() {
    const theme = useTheme();
    return <ViewportLayout layout={{ ratio: "column", color: "white" }} />;
}

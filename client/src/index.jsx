import "./style.css";
import ReactDOM from "react-dom/client";
const root = ReactDOM.createRoot(document.querySelector("#root"));

import { useStore } from "./store/useStore";

// import { loadCSVData } from "./utils.js";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./ui/theme.js";
import App from "./App";

// load schema database
loadSchema();

root.render(
    <>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </>
);

// PLACEHOLDER - replace with a call to the server
async function loadSchema() {
    try {
        const response = await fetch("./data/schema.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch schema: ${response.statusText}`);
        }
        const schema = await response.json();

        const indexes = Object.keys(schema);
        useStore.setState({ schema, indexes, activeIndex: indexes[0] });
    } catch (error) {
        console.error("Error loading schema:", error);
    }
}

// function init() {
//     let w = window.innerWidth;
//     let h = window.innerHeight;

//     const bnrH = Math.round(window.innerHeight * 0.08);

//     useStore.setState({ bnrH: bnrH });

//     console.log(w, h, bnrH);
// }

// async function Init() {
//     // const database = await loadCSVData(`./data/OMNIART_subsample.csv`, true);
//     const database = await loadCSVData(
//         `./data/omniart_CLIP_embeddings.csv`,
//         true
//     );
//     console.log(database);
//     // Clean color_palette column & palette count & clip embeddings
//     database.forEach((d, i) => {
//         d["color_palette"] = d["color_palette"]
//             .split("'")
//             .map((x, i) => {
//                 if (i % 2 == 1) return x;
//             })
//             .filter((x) => x);
//         d["palette_count"] = d["palette_count"]
//             .substr(1, d["palette_count"].length - 2)
//             .split(",")
//             .map((x) => parseInt(x));
//         d["CLIP_embeddings"] = d["CLIP_embeddings"].split(",").map((x) => {
//             return parseFloat(x);
//         });
//     });

//     useStore.setState({ database: database, data: database });
// }

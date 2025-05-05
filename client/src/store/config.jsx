// main refs -------------------------------------------------------------------------------------------
import theme from "../ui/theme";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", BACKEND_URL);

// icons -------------------------------------------------------------------------------------------
import InterpretIcon from "@mui/icons-material/ManageSearch";
// '@mui/icons-material/Category';
import AnalyzeIcon from "@mui/icons-material/Functions";
import InspectIcon from "@mui/icons-material/Search";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import PinIcon from "@mui/icons-material/Pin";
import PieChartIcon from "@mui/icons-material/PieChart";
import MetaSearchIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import GridIcon from "@mui/icons-material/Apps";
import SelectIcon from "@mui/icons-material/Done";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CompositionIcon from "@mui/icons-material/SelectAll";

// functions ---------------------------------------------------------------------------------------
import PickChoose from "../ui/pages/PickChoose";
import MetaSearch from "../ui/pages/MetaSearch";
import SemanticSearch from "../ui/pages/SemanticSearch";
import ColorWheel from "../ui/pages/ColorWheel";
import Composition from "../ui/pages/Composition";
import Sort from "../ui/pages/Sort";

// config ------------------------------------------------------------------------------------------

const colors = {
    inspect: theme.palette.extra.inspect,
    interpret: theme.palette.extra.interpret,
    analyze: theme.palette.extra.analyze,
};

const columns = {
    linear: {
        paintings: ["century", "creation_year"],
        masks: ["height", "width"],
    },
    categorical: {
        paintings: [
            // "artist_last_name",
            "century",
            "collection_origins",
            "school",
            "artwork_type",
        ],
        masks: [],
    },
};

const actionBtns = {
    icon: <null />,
    btns: [
        {
            name: "inspect",
            icon: <VisibilityIcon />,
            color: colors["inspect"],

            btns: [
                {
                    name: "pickChoose",
                    icon: <SelectIcon />,
                    fn: PickChoose,
                },
                {
                    name: "composition",
                    icon: <CompositionIcon />,
                    fn: Composition,
                },
                {
                    name: "download",
                    icon: <DownloadIcon />,
                    fn: null,
                },
            ],
        },
        {
            name: "interpret",
            icon: <InterpretIcon />,
            color: colors["interpret"],
            btns: [
                {
                    name: "metaSearch",
                    icon: <MetaSearchIcon />,
                    fn: MetaSearch,
                },
                {
                    name: "timeRange",
                    icon: <AccessTimeIcon />,
                    fn: null,
                },
                {
                    name: "semanticSearch",
                    icon: <FormatShapesIcon />,
                    fn: SemanticSearch,
                },
            ],
        },
        {
            name: "analyze",
            icon: <AnalyzeIcon />,
            color: colors["analyze"],

            btns: [
                {
                    name: "colorWheel",
                    icon: <ColorLensIcon />,
                    fn: ColorWheel,
                },
                {
                    name: "tsne",
                    icon: <BubbleChartIcon />,
                    fn: null,
                },
                {
                    name: "umap",
                    icon: <GridIcon />,
                    fn: null,
                },
                {
                    name: "piechart",
                    icon: <PieChartIcon />,
                    fn: null,
                },
                {
                    name: "sort",
                    icon: <ShowChartIcon />,
                    fn: Sort,
                },
            ],
        },
    ],
};

const info = {
    sort: "This feature enables users to explore the distribution of values within a selected numerical column through an interactive plot. A range selector allows users to interpret the dataset dynamically, focusing on entries that fall within a specific value interval. It's particularly useful for quickly identifying trends, outliers, or dominant ranges in any linear attribute of the collection.",

    pickChoose:
        "Pick n Choose offers a detailed, manual way to curate the collection, allowing users to inspect each painting individually. Through a simple interface, users can accept or discard entries by visual inspection. A magnifying lens tool enhances this process by enabling zoom into the artworks, making it easier to appreciate fine details and make more informed decisions during interpreting.",

    colorWheel:
        "Color Wheel arranges the collection in a circular layout based on the predominant colors of each entry. Hovering over an artwork reveals additional metadata, while a color bar chart displays the full palette and the proportional presence of each color. Users can interactively slice the wheel to interpret paintings with similar color affinities, providing a visually intuitive way to explore chromatic themes.",

    composition:
        "The Composition tool provides insight into the physical dimensions of each painting and, when segmentation masks are available, their spatial structure. It visualizes the relative position and shape of elements within the artwork, enabling users to interpret the collection based on compositional similarity—whether in terms of shape, layout, or spatial arrangement of visual features.",

    semanticSearch:
        "Semantic Search uses CLIP embeddings to interpret the collection based on textual prompts. By entering a descriptive phrase, users retrieve paintings whose visual content aligns semantically with the input. A cosine similarity threshold can be adjusted to refine the precision or breadth of the results, offering a powerful way to search beyond keywords or metadata.",

    metaSearch:
        "This feature enables interpreting based on categorical metadata fields, such as artist, period, or genre. Users can select a column and refine the dataset accordingly. A scatterplot visualizes the distribution and clustering of values within the database, helping identify patterns and relationships within the selected category.",
};

actionBtns.btns.forEach((cat) => {
    cat.btns.forEach((btn) => {
        btn.color = cat.color;
        btn.category = cat.name;
        btn.dev = btn.fn != null ? true : false;
        btn.info = info[btn.name];
    });
});

export { BACKEND_URL, actionBtns, colors, columns };

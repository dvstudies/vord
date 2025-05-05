import { Fragment } from "react";
import theme from "../ui/theme";

// icons -------------------------------------------------------------------------------------------
import FilterListIcon from "@mui/icons-material/FilterList";
import AnalyzeIcon from "@mui/icons-material/Assessment";
import InspectIcon from "@mui/icons-material/Search";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import PinIcon from "@mui/icons-material/Pin";
import PieChartIcon from "@mui/icons-material/PieChart";
import TuneIcon from "@mui/icons-material/Tune";
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
    filter: theme.palette.extra.filter,
    analyze: theme.palette.extra.analyze,
};

const actionBtns = {
    icon: <></>,
    btns: [
        {
            name: "inspect",
            icon: <VisibilityIcon />,
            color: colors["inspect"],

            btns: [
                {
                    name: "pickChoose",
                    icon: <SelectIcon />,
                    fn: <PickChoose />,
                },
                {
                    name: "composition",
                    icon: <CompositionIcon />,
                    fn: <Composition />,
                },
                {
                    name: "download",
                    icon: <DownloadIcon />,
                    fn: <></>,
                },
            ],
        },
        {
            name: "filter",
            icon: <FilterListIcon />,
            color: colors["filter"],
            btns: [
                {
                    name: "metaSearch",
                    icon: <TuneIcon />,
                    fn: <MetaSearch />,
                },
                {
                    name: "timeRange",
                    icon: <AccessTimeIcon />,
                    fn: <></>,
                },
                {
                    name: "semanticSearch",
                    icon: <FormatShapesIcon />,
                    fn: <SemanticSearch />,
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
                    fn: <ColorWheel />,
                },
                {
                    name: "tsne",
                    icon: <BubbleChartIcon />,
                    fn: <></>,
                },
                {
                    name: "umap",
                    icon: <GridIcon />,
                    fn: <></>,
                },
                {
                    name: "piechart",
                    icon: <PieChartIcon />,
                    fn: <></>,
                },
                {
                    name: "sort",
                    icon: <ShowChartIcon />,
                    fn: <Sort />,
                },
            ],
        },
    ],
};

actionBtns.btns.forEach((cat) => {
    cat.btns.forEach((btn) => {
        btn.color = cat.color;
        btn.category = cat.name;

        const dev =
            btn.fn.type === Fragment && !btn.fn.props.children ? false : true;

        btn.dev = dev;

        if (dev) {
            btn.fn = (
                <btn.fn.type
                    {...btn.fn.props}
                    color={btn.color}
                />
            );
        }
    });
});

export { actionBtns, colors };

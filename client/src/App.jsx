import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Banner from "./ui/structure/Banner.jsx";
import Nav from "./ui/structure/Nav.jsx";
import Pagination from "./ui/structure/Pagination.jsx";
import ContentManager from "./ui/structure/ContentManager.jsx";

const App = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                p: theme.mainContainerPadding, // outer white border
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Banner />

            <Box sx={{ flex: 1, display: "flex", height: "100%" }}>
                <Nav />
                <ContentManager />
            </Box>

            <Pagination />
        </Box>
    );
};

export default App;

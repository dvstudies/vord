import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { CollectionsBookmarkRounded } from "@mui/icons-material";

export default function Banner() {
    const theme = useTheme();
    const imgPath = "V_logo.png";
    const btns = [
        { icon: <InfoOutlinedIcon />, text: "About", fn: <ContentAbout /> },
        {
            icon: <HelpOutlineOutlinedIcon />,
            text: "Help",
            fn: <ContentHelp />,
        },
        // {
        //     icon: <StorageOutlinedIcon />,
        //     text: "Database",
        //     fn: <ContentDatabase />,
        // },
    ];

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState(null);

    const handleOpen = (id) => {
        setContent(id + 1);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const modalS = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60%",
        height: "60%",
        bgcolor: "black",
        color: "white",
        border: "2px solid #999",
        padding: "50px",
        borderRadius: theme.brdRad,
        boxShadow: 24,
        p: 4,
        overflow: "auto",
    };

    return (
        <>
            <Box
                sx={{
                    height: `${theme.bnrH}px`,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        ...theme.btnS,
                        background: "linear-gradient(45deg, #000000, #222222)",
                    }}
                    className="holomorphic"
                ></Box>
                <Box
                    sx={{
                        ...theme.btnS,
                        bgcolor: "transparent",
                        flexGrow: 1,
                    }}
                ></Box>
                {btns.map((btn, i) => (
                    <Box
                        key={i}
                        sx={{
                            ...theme.btnS,

                            marginTop: `${theme.btnM}px`,
                            marginBottom: `${theme.btnM}px`,
                            bgcolor: "rgba(0, 0, 0, 0.1)",
                            // ...styleProps.btnTextS,
                        }}
                        arial-label={btn.text}
                        className="holomorphic"
                    >
                        <IconButton
                            sx={{ height: "100%", width: "100%" }}
                            onClick={(e, id = i) => handleOpen(id)}
                        >
                            {btn.icon}
                        </IconButton>
                    </Box>
                ))}

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={modalS}
                        className="inv"
                    >
                        {content &&
                            btns.map((btn, i) => {
                                if (i === content - 1) {
                                    return btn.fn;
                                }
                            })}
                    </Box>
                </Modal>
            </Box>
        </>
    );
}

function ContentAbout() {
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
            >
                The following is a template for the About section
            </Typography>
            <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
            >
                Visual Open Research Data
                <br />
                <br />
                VORD aims to enhance our understanding of cultural heritage by
                extracting quantitative information from vast artistic and
                visual cultural heritage databases. Utilizing advanced machine
                learning models, our project focuses on automatically extracting
                various visual features, including color analysis, figure
                positioning, and interpreting the dense embedding space of these
                images. By combining different models, we enable comprehensive
                visual quantitative semantic analysis, expanding the breadth of
                art historical questions and offering new perspectives on art
                historical narratives. This approach shifts the focus from
                analyzing full images to detailed object semantic analysis,
                exploiting inherent formalistic information that is otherwise
                invisible. Our methodology enhances the transparency and
                interpretability of machine learning models applied to cultural
                heritage data, making them more accessible for researchers,
                curators, and educators. The project highlights the potential of
                combining advanced machine learning techniques with structured
                semantic information to improve the analysis and understanding
                of art historical content. This approach facilitates the sharing
                of metadata in common file formats, promoting reuse and
                interoperability, and complements existing methodologies without
                addressing interoperability issues between legacy database
                systems and data ontologies.
            </Typography>
        </Box>
    );
}

function ContentHelp() {
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
            >
                The following is a template for the About section
            </Typography>
        </Box>
    );
}

function ContentDatabase() {
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
            >
                The following is a template for the Database section
            </Typography>
            <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
            >
                Here the information about the processed database should be
                reported.
                <br />
                <br />
                Lots of numbers
                <br />
                Lots of numbers
                <br />
                Lots of numbers
                <br />
                Lots of numbers
                <br />
                Lots of numbers
                <br />
                Lots of numbers
            </Typography>
        </Box>
    );
}

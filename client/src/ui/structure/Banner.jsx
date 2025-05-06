import ReactMarkdown from "react-markdown";

import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { CollectionsBookmarkRounded } from "@mui/icons-material";

import GitHubIcon from "@mui/icons-material/GitHub";

export default function Banner() {
    const theme = useTheme();
    const imgPath = "V_logo.png";
    const btns = [
        {
            icon: <HelpOutlineOutlinedIcon />,
            text: "About",
            fn: <ContentAbout />,
            modal: true,
        },

        {
            icon: <GitHubIcon />,
            text: "Repo",
            modal: false,
            fn: () =>
                window.open("https://github.com/dvstudies/vord", "_blank"),
        },
        // {
        //     icon: <StorageOutlinedIcon />,
        //     text: "Database",
        //     fn: <ContentDatabase />,
        // },
        ,
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
        // bgcolor: "black",
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
                            onClick={(e, id = i) =>
                                btn.modal ? handleOpen(id) : btn.fn(e, id)
                            }
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
                        sx={{
                            ...modalS,
                            backgroundColor: "rgba(0,0,0,0.5)",

                            opacity: 1,
                            backdropFilter: "blur(30px)",
                        }}
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
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch("./about.md")
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ReactMarkdown
                components={{
                    h1: ({ ...props }) => (
                        <Typography
                            variant="h1"
                            {...props}
                            sx={{
                                textAlign: "center",
                                mt: "5vh",
                                color: theme.palette.white.main,
                            }}
                        />
                    ),
                    h2: ({ ...props }) => (
                        <Typography
                            variant="h2"
                            {...props}
                            sx={{
                                textAlign: "center",
                                mx: 20,
                                mt: theme.bannerH,
                                color: theme.palette.white.main,
                            }}
                        />
                    ),
                    h3: ({ ...props }) => (
                        <Typography
                            variant="h3"
                            {...props}
                            sx={{
                                mt: theme.bannerH,
                                color: theme.palette.white.main,
                            }}
                        />
                    ),
                    p: ({ ...props }) => (
                        <Typography
                            variant="body1"
                            {...props}
                            sx={{
                                textAlign: "justify",
                                m: "1em 0",
                                mx: 3,
                                color: theme.palette.white.main,
                            }}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Box>
    );
}

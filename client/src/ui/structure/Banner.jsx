import ReactMarkdown from "react-markdown";

import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { CollectionsBookmarkRounded } from "@mui/icons-material";

import { useStore } from "../../store/useStore";

import GitHubIcon from "@mui/icons-material/GitHub";

export default function Banner() {
    const theme = useTheme();
    const activeFilterId = useStore((state) => state.activeFilterId);
    const mainViewProperties = useStore(
        (state) =>
            state.mainViewProperties || { width: 0, height: 0, left: 0, top: 0 }
    );

    // const filtersHistory = useStore.getState().filtersHistory;
    // const filtersHistory = useStore((state) => state.filtersHistory);

    const imgPath = "V_logo.png";
    const btns = [
        {
            icon: <HelpOutlineOutlinedIcon />,
            text: "About",
            onCLick: (e, i) => handleOpen(i),
            fn: <ContentAbout />,
            modal: true,
        },

        {
            icon: <GitHubIcon />,
            text: "Repo",
            modal: false,
            onCLick: (e, i) => {
                reset();

                window.open("https://github.com/dvstudies/vord", "_blank");
            },

            fn: <></>,
        },
        // {
        //     icon: <StorageOutlinedIcon />,
        //     text: "Database",
        //     fn: <ContentDatabase />,
        // },
        ,
    ];

    const [open, setOpen] = useState(true);
    const [content, setContent] = useState(null);

    // useEffect(() => {
    //     if (mainViewProperties) {
    //         setOpen(true);
    //         setContent(1);
    //         useStore.setState({ modalOn: true });
    //     }
    // }, [mainViewProperties]);

    function reset() {
        setOpen(false);
        setContent(null);
        useStore.setState({ modalOn: false });
    }

    const handleOpen = (id) => {
        if (content == id + 1) {
            reset();
        } else {
            setOpen(true);
            setContent(id + 1);
            useStore.setState({ modalOn: true });
        }
    };

    useEffect(() => {
        reset();
    }, [activeFilterId]);

    const handleClose = () => setOpen(false);

    const modalS = {
        position: "absolute",
        ...mainViewProperties,

        padding: "50px",
        borderRadius: theme.brdRad,
        p: 4,
        overflow: "auto",
        pointerEvents: "auto",
        zIndex: 10,
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
                            // onClick={(e, id = i) =>
                            //     btn.modal ? handleOpen(id) : btn.fn(e, id)
                            // }
                            onClick={(e, id = i) => btn.onCLick(e, id)}
                        >
                            {btn.icon}
                        </IconButton>
                    </Box>
                ))}

                {open && (
                    <Box
                        sx={{
                            ...modalS,
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
                )}
            </Box>
        </>
    );
}

function ContentAbout() {
    const theme = useTheme();
    const [content, setContent] = useState(null);

    const firstParagraphRendered = useRef(false);

    const firstS = {
        mb: 15,
        mx: 20,
        textAlign: "center",
    };

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

                my: 10,
                mb: 20,
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
                    p: ({ ...props }) => {
                        const isFirst = !firstParagraphRendered.current;
                        if (isFirst) firstParagraphRendered.current = true;

                        return (
                            <Typography
                                variant="body1"
                                {...props}
                                sx={{
                                    m: "1em 0",
                                    mx: 10,
                                    mb: 5,
                                    textAlign: "justify",
                                    color: theme.palette.white.main,
                                    ...(isFirst ? firstS : {}),
                                }}
                            />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </Box>
    );
}

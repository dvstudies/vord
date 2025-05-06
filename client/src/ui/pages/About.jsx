import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";

export default function About() {
    const theme = useTheme();
    const [content, setContent] = useState(null);

    // const memoizedContent = useMemo(() => {
    //     let fetchedContent = null;
    //     fetch("./about.md")
    //         .then((res) => res.text())
    //         .then((text) => {
    //             fetchedContent = text;
    //         });
    //     return fetchedContent;
    // }, []);

    // useEffect(() => {
    //     setContent(memoizedContent);
    // }, [memoizedContent]);

    useEffect(() => {
        fetch("./about.md")
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
            }}
        >
            <Box
                sx={{
                    // pt: theme.btnM * 2,
                    // pb: theme.btnM * 4,
                    maxHeight: "50vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    overflowY: "scroll",
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
        </Box>
    );
}

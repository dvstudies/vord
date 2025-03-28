require("dotenv").config();
const express = require("express");
const { Client } = require("@opensearch-project/opensearch");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Allow cors for backend / frontend communication
app.use(cors()); // Allows all origins
// app.use(
//     cors({
//         origin: "https://neriiacopo.github.io",
//     })
// );

// Serve static files (index.html)
// app.use(express.static("public"));

// Connect to OpenSearch client
const OPENSEARCH_URL = process.env.OPENSEARCH_URL;
const OPENSEARCH_USER = process.env.OPENSEARCH_USER;
const OPENSEARCH_PASS = process.env.OPENSEARCH_PASS;
const PORT = process.env.PORT || 5000;

const client = new Client({
    node: OPENSEARCH_URL,
    auth: {
        username: OPENSEARCH_USER,
        password: OPENSEARCH_PASS,
    },
});

// // Add all routes
// fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
//     const route = require(`./routes/${file}`);
//     app.use("/", route);

//     // // The following nests the endpoints based on the router filename
//     // const baseName = path.basename(file, ".js"); // e.g. "paintingsRoutes" → "paintings"
//     // const routePath = "/" + baseName.replace("Routes", "").toLowerCase(); // "/paintings"
//     // app.use(routePath, route);
// });

// CLIP similarity search endpoint
app.post("/semsegsearch", async (req, res) => {
    const { index, embedding } = req.body;

    // Validate the input
    if (!embedding || !Array.isArray(embedding) || embedding.length !== 512) {
        return res
            .status(400)
            .json({ error: "Invalid or missing embedding vector" });
    }

    try {
        const response = await client.search({
            index: index,
            body: {
                size: 10,
                query: {
                    knn: {
                        CLIP_embeddings: {
                            vector: embedding,
                            k: 10,
                        },
                    },
                },
            },
        });

        if (index == "paintings") {
            const results = response.body.hits.hits.map((hit) => ({
                id: hit._id,
                score: hit._score,
                ...hit._source,
            }));

            res.json(results);
        } else {
            const masks = response.body.hits.hits.map((hit) => ({
                id: hit._id,
                score: hit._score,
                ...hit._source,
            }));

            const omniIds = masks.map((mask) => mask.omni_id);

            const paintingQuery = await client.search({
                index: "paintings",
                body: {
                    size: omniIds.length,
                    query: {
                        terms: {
                            omni_id: omniIds,
                        },
                    },
                },
            });

            console.log(paintingQuery);

            const paintingMap = {};
            paintingQuery.body.hits.hits.forEach((hit) => {
                paintingMap[hit._source.omni_id] = hit._source;
            });

            // Step 3: Attach painting data to each mask
            const enriched = masks.map((mask) => ({
                ...(paintingMap[mask.omni_id] || null),
                mask: mask,
            }));

            res.json(enriched);
        }
    } catch (error) {
        console.error("Error performing CLIP search:", error);
        res.status(500).send("Error performing CLIP search");
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at ${OPENSEARCH_URL}`));

const express = require("express");
const router = express.Router();

router.post("/semsegsearch", async (req, res) => {
    const { index, embedding } = req.body;

    const client = req.app.locals.client;
    console.log(client);

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

            const paintingMap = {};
            paintingQuery.body.hits.hits.forEach((hit) => {
                paintingMap[hit._source.omni_id] = hit._source;
            });

            // Step 3: Attach painting data to each mask
            const enriched = masks.map((mask) => ({
                ...(paintingMap[mask.omni_id] || null),
                mask: mask,
            }));

            console.log(enriched);

            res.json(enriched);
        }
    } catch (error) {
        console.error("Error performing CLIP search:", error);
        res.status(500).send("Error performing CLIP search");
    }
});

module.exports = router;

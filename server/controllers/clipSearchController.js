import { buildOpenSearchFilter } from "../utils/utils.js";

export const clipSearchPost = async (req, res) => {
    try {
        const { index, embeddings, size = 100, clauses } = req.body;
        const client = req.app.locals.client;

        if (!embeddings || !index) {
            return res
                .status(400)
                .json({ error: "Missing required parameters." });
        }

        const filter = buildOpenSearchFilter(clauses) || { match_all: {} };

        if (index === "paintings") {
            const knnSearch = await client.search({
                index: "paintings",
                body: {
                    size,
                    query: {
                        bool: {
                            must: [
                                {
                                    knn: {
                                        CLIP_embeddings: {
                                            vector: embeddings,
                                            k: size,
                                            filter: {
                                                bool: {
                                                    filter,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            });

            const hits = knnSearch.body.hits.hits;
            const sources = hits.map((hit) => ({
                ...hit._source,
                _id: hit._id,
                _score: hit._score,
            }));

            return res.json({ index, distribution: sources });
        }

        if (index === "masks") {
            // 1. Filter paintings
            const knnPreSearch = await client.search({
                index: "paintings",
                body: {
                    size: 10000,
                    _source: ["omni_id"],
                    query: {
                        bool: {
                            filter,
                        },
                    },
                },
            });

            const preOmniIds = knnPreSearch.body.hits.hits
                .map((hit) => hit._source.omni_id)
                .filter(Boolean);

            if (preOmniIds.length === 0) {
                return res
                    .status(404)
                    .json({ error: "No matching paintings found." });
            }

            // 2. Search masks with KNN + filter by preOmniIds
            const knnSearch = await client.search({
                index: "masks",
                body: {
                    size,
                    query: {
                        bool: {
                            must: [
                                {
                                    knn: {
                                        CLIP_embeddings: {
                                            vector: embeddings,
                                            k: size,
                                            filter: {
                                                bool: {
                                                    filter: [
                                                        {
                                                            terms: {
                                                                omni_id:
                                                                    preOmniIds,
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            });

            const hits = knnSearch.body.hits.hits;

            const masks = hits.map((hit) => ({
                id: hit._id,
                score: hit._score,
                ...hit._source,
            }));

            // avoid retrieving duplicate paintings when mask is same
            const uniqueOmniIds = [...new Set(masks.map((m) => m.omni_id))];

            const paintingQuery = await client.search({
                index: "paintings",
                body: {
                    size: uniqueOmniIds.length,
                    query: {
                        terms: {
                            omni_id: uniqueOmniIds,
                        },
                    },
                },
            });

            // Bring _id inside _source for each painting hit
            paintingQuery.body.hits.hits.forEach((hit) => {
                hit._source._id = hit._id;
            });

            const paintingMap = paintingQuery.body.hits.hits.reduce(
                (acc, hit) => {
                    acc[hit._source.omni_id] = hit._source;
                    return acc;
                },
                {}
            );

            const enriched = masks.map((mask) => ({
                ...(paintingMap[mask.omni_id] || {}),
                _score: mask.score,
                mask,
            }));

            return res.json({ index, distribution: enriched });
        }

        return res.status(400).json({ error: "Unsupported index." });
    } catch (err) {
        console.error("Error in Semantic Search Controller:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

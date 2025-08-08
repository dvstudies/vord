import { buildOpenSearchFilter } from "../utils/utils.js";

export const metaSearchPost = async (req, res) => {
    try {
        const {
            column,
            index,
            clauses,
            maxCats = 100,
            type = "text",
        } = req.body;
        const client = req.app.locals.client;

        console.log(
            "Received request for categorical stats:",
            column,
            index,
            clauses,
            type,
            maxCats
        );

        if (!column || !index) {
            return res.status(400).json({ error: "Missing column or index." });
        }

        const filter = buildOpenSearchFilter(clauses) || { match_all: {} };

        const response = await client.search({
            index,
            body: {
                size: 0, // Don't return actual docs
                aggs: {
                    terms_agg: {
                        terms: {
                            field: column,
                            size: maxCats, // Max number of unique values to return
                        },
                    },
                },
                query: {
                    bool: { filter },
                },
            },
        });

        const buckets = response.body.aggregations.terms_agg.buckets;

        const distribution = buckets.map((b) => ({
            label: b.key,
            count: b.doc_count,
        }));

        res.json({
            column,
            distribution,
        });
    } catch (err) {
        console.error("Error in metaSearchPost:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

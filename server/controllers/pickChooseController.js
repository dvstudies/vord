import { buildOpenSearchFilter } from "../utils/utils.js";

export const pickChoosePost = async (req, res) => {
    try {
        const { index, clauses, size = 20 } = req.body;
        const client = req.app.locals.client;

        console.log(
            "Received request for visual enquiry:",
            index,
            clauses,
            size
        );

        if (!index) {
            return res.status(400).json({ error: "Missing column or index." });
        }

        const filter = buildOpenSearchFilter(clauses) || { match_all: {} };

        const response = await client.search({
            index,
            body: {
                size: size,
                query: {
                    bool: {
                        must: { match_all: {} },
                        filter,
                    },
                },
            },
        });

        const output = response.body.hits.hits;

        output.forEach((hit) => {
            hit._source._id = hit._id;
            hit._source._index = hit._index;
        });

        console.log("Output:", output);
        res.json(output.map((hit) => hit._source));
    } catch (err) {
        console.error("Error in pickChoose:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

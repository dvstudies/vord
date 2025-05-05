import { buildOpenSearchFilter } from "../utils.js";

export const sortGet = async (req, res) => {
    const { index, column } = req.query;
};

export const sortPost = async (req, res) => {
    try {
        const {
            column,
            index,
            maxBins = 10,
            type = "integer",
            clauses,
        } = req.body;
        const client = req.app.locals.client;

        console.log(
            "Received request to sort data:",
            column,
            index,
            "clauses",
            clauses
        );

        if (!column || !index) {
            return res
                .status(404)
                .json({ error: "Unable to fetch data: undefined inputs" });
        }

        const filter = buildOpenSearchFilter(clauses) || {
            match_all: {},
        };
        const statsResp = await client.search({
            index,
            body: {
                size: 0,
                aggs: {
                    min_val: { min: { field: column } },
                    max_val: { max: { field: column } },
                },
                query: {
                    bool: {
                        filter,
                    },
                },
            },
        });

        const min = statsResp.body.aggregations.min_val.value;
        const max = statsResp.body.aggregations.max_val.value;

        if (min == null || max == null) {
            return res
                .status(404)
                .json({ error: "No data found in specified column." });
        }

        const range = max - min;
        const bins = range < maxBins ? range + 1 : maxBins;
        const interval = Math.ceil(range / bins);

        const histResp = await client.search({
            index,
            body: {
                size: 0,
                aggs: {
                    histogram: {
                        histogram: {
                            field: column,
                            interval: interval,
                        },
                    },
                },
                query: {
                    bool: {
                        filter,
                    },
                },
            },
        });

        const buckets = histResp.body.aggregations.histogram.buckets;

        const distribution = buckets.map((b) => {
            let label = b.key;
            if (type === "date") {
                const year = new Date(b.key).getFullYear();
                label = isNaN(year) ? null : year;
            }
            return {
                value: label,
                count: b.doc_count,
            };
        });

        res.json({
            column,
            min,
            max,
            bins,
            interval,
            distribution,
        });
    } catch (err) {
        console.error("Error in histogram controller:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

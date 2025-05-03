export const sortGet = async (req, res) => {
    const { index, column } = req.query;
};

export const sortPost = async (req, res) => {
    try {
        const { column, index } = req.body;
        const client = req.app.locals.client;

        if (!column || !index) {
            return res
                .status(404)
                .json({ error: "Unable to fetch data: undefined inputs" });
        }

        const statsResp = await client.search({
            index,
            size: 0,
            aggs: {
                min_val: { min: { field: column } },
                max_val: { max: { field: column } },
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
        const bins = range < 10 ? range + 1 : 10;
        const interval = Math.ceil(range / bins);

        const histResp = await client.search({
            index,
            size: 0,
            aggs: {
                century_histogram: {
                    histogram: {
                        field: column,
                        interval: interval,
                    },
                },
            },
        });

        const buckets = histResp.body.aggregations.century_histogram.buckets;

        res.json({
            min,
            max,
            bins,
            interval,
            distribution: buckets.map((b) => ({
                bin: b.key,
                count: b.doc_count,
            })),
        });
    } catch (err) {
        console.error("Error in histogram controller:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

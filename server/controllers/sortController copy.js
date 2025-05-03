const sortGet = async (req, res) => {
    const { index, column } = req.query;

    const client = req.app.locals.client;

    try {
        const response = await client.search({
            index,
            body: {
                size: 1000,
                _source: [column],
                query: {
                    match_all: {},
                },
            },
        });

        const data = response.body.hits.hits
            .map((doc) => doc._source?.[column])
            .filter((c) => c !== undefined);

        res.json(data);
    } catch (error) {
        console.error("Error retrieving Century values:", error);
        throw error;
    }
};

const sortPost = async (req, res) => {
    console.log("req", req);
    console.log("res", res);
    console.log("body", req.body); // logs { column: ... }
};

module.exports = { sortGet, sortPost };

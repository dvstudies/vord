import express from "express";
import { sortGet, sortPost } from "../controllers/sortController.js";
import { metaSearchPost } from "../controllers/metaSearchController.js";
import { buildOpenSearchFilter } from "../utils.js";

const router = express.Router();

router.get("/get/analyze/sort", sortGet);
router.post("/post/analyze/sort", sortPost);
router.post("/post/interpret/metaSearch", metaSearchPost);

router.post("/post/filter", async (req, res) => {
    console.log("---- Filter request ----");
    console.log("req.headers:", req.headers);
    console.log("req.body:", req.body);
    console.log("client config:", req.app.locals.client.connectionPool);

    const { clauses } = req.body;
    const index = "paintings";
    const client = req.app.locals.client;

    console.log(client._auth);
    if (!index || !clauses) {
        return res
            .status(400)
            .json({ error: "Index and clauses are required." });
    }

    try {
        const filter = buildOpenSearchFilter(clauses) || {
            match_all: {},
        };
        const response = await client.search({
            index,
            body: {
                size: 0, // Don't return hits
                track_total_hits: true, // Ensure accurate count
                query: {
                    bool: {
                        filter,
                    },
                },
            },
        });

        const count = response.body.hits.total.value;

        res.json({ count });
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

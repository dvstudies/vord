import express from "express";

import { buildOpenSearchFilter } from "../utils/utils.js";
import { sortPost } from "../controllers/sortController.js";
import { metaSearchPost } from "../controllers/metaSearchController.js";
import { clipSearchPost } from "../controllers/clipSearchController.js";
import { pickChoosePost } from "../controllers/pickChooseController.js";
import { colorWheelController } from "../controllers/colorWheelController.js";

const router = express.Router();

router.post("/post/analyze/sort", sortPost);
router.post("/post/analyze/colorWheel", colorWheelController);
router.post("/post/interpret/metaSearch", metaSearchPost);
router.post("/post/interpret/semanticSearch", clipSearchPost);
router.post("/post/inspect/imageSearch", clipSearchPost);
router.post("/post/inspect/pickChoose", pickChoosePost);

router.post("/post/filter", async (req, res) => {
    const { clauses } = req.body;
    const index = "paintings";
    const client = req.app.locals.client;

    if (!index || !clauses) {
        return res
            .status(400)
            .json({ error: "Index and clauses are required." });
    }

    try {
        const filter = buildOpenSearchFilter(clauses);
        const hasFilter = filter.length > 0;

        console.log("Filter:", filter);
        const response = await client.search({
            index,
            body: {
                size: 0, // Don't return hits
                track_total_hits: true, // Ensure accurate count
                query: hasFilter ? { bool: { filter } } : { match_all: {} },
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

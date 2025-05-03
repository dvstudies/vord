import express from "express";
import { sortGet, sortPost } from "../controllers/sortController.js";

const router = express.Router();

router.get("/get/analyze/sort", sortGet);
router.post("/post/analyze/sort", sortPost);

export default router;

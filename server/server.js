import "dotenv/config";
import express from "express";
import { Client } from "@opensearch-project/opensearch";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// OpenSearch client
const OPENSEARCH_URL = process.env.OPENSEARCH_URL;
const OPENSEARCH_USER = process.env.OPENSEARCH_USER;
const OPENSEARCH_PASS = process.env.OPENSEARCH_PASS;
const PORT = process.env.PORT || 5000;

const client = new Client({
    node: OPENSEARCH_URL,
    auth: {
        username: OPENSEARCH_USER,
        password: OPENSEARCH_PASS,
    },
});

app.locals.client = client;

// Auto-load routes
const loadRoutes = async () => {
    const routesDir = path.join(__dirname, "routes");
    const files = fs.readdirSync(routesDir);

    for (const file of files) {
        const route = await import(`./routes/${file}`);
        const baseName = path.basename(file, ".js");
        const routePath = "/" + baseName.toLowerCase();
        app.use(routePath, route.default);
    }
};

await loadRoutes();

app.listen(PORT, () => console.log(`🚀 Server running at ${OPENSEARCH_URL}`));

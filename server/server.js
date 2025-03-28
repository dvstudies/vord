require("dotenv").config();
const express = require("express");
const { Client } = require("@opensearch-project/opensearch");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Allow cors for backend / frontend communication
app.use(cors()); // Allows all origins

// app.use(
//     cors({
//         origin: "https://neriiacopo.github.io",
//     })
// );

// Connect to OpenSearch client
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

// Add all routes
fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
    const route = require(`./routes/${file}`);
    app.use("/", route);

    // // The following nests the endpoints based on the router filename
    // const baseName = path.basename(file, ".js"); // e.g. "paintingsRoutes" → "paintings"
    // const routePath = "/" + baseName.replace("Routes", "").toLowerCase(); // "/paintings"
    // app.use(routePath, route);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at ${OPENSEARCH_URL}`));

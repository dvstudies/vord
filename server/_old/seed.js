require("dotenv").config();
const { Client } = require("@opensearch-project/opensearch");

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

async function createIndices() {
    try {
        // Create Paintings Index
        await client.indices.create({
            index: "paintings",
            body: {
                mappings: {
                    properties: {
                        title: { type: "text" },
                        artist: { type: "keyword" },
                        year: { type: "integer" },
                        movement: { type: "keyword" },
                        clip_embedding: { type: "dense_vector", dims: 512 },
                        tags: { type: "keyword" },
                    },
                },
            },
        });

        // Create Masks Index
        await client.indices.create({
            index: "masks",
            body: {
                mappings: {
                    properties: {
                        painting_id: { type: "keyword" },
                        category: { type: "keyword" },
                        mask_embedding: { type: "dense_vector", dims: 512 },
                        color_palette: { type: "keyword" },
                    },
                },
            },
        });

        console.log("✅ Indices created successfully");
    } catch (error) {
        console.error("❌ Error creating indices:", error);
    }
}

async function insertSampleData() {
    try {
        // Sample paintings
        await client.index({
            index: "paintings",
            id: "3",
            body: {
                title: "The Last Supper",
                artist: "Leonardo da Vinci",
                year: 1495,
                movement: "Renaissance",
                clip_embedding: Array(512).fill(0.1),
                tags: ["religious", "Christ", "disciples"],
            },
        });

        await client.index({
            index: "paintings",
            id: "2",
            body: {
                title: "Madonna del Prato",
                artist: "Raphael",
                year: 1506,
                movement: "Renaissance",
                clip_embedding: Array(512).fill(0.2),
                tags: ["Madonna", "child", "religious"],
            },
        });

        // Sample masks (segmentation)
        await client.index({
            index: "masks",
            id: "m1",
            body: {
                painting_id: "1",
                category: "robe",
                mask_embedding: Array(512).fill(0.3),
                color_palette: ["blue", "gold"],
            },
        });

        await client.index({
            index: "masks",
            id: "m2",
            body: {
                painting_id: "2",
                category: "background",
                mask_embedding: Array(512).fill(0.4),
                color_palette: ["green", "brown"],
            },
        });

        console.log("✅ Sample data inserted");
    } catch (error) {
        console.error("❌ Error inserting data:", error);
    }
}

// Run functions
(async () => {
    await createIndices();
    await insertSampleData();
})();

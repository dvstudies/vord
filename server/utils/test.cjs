require("dotenv").config();
const express = require("express");
const { Client } = require("@opensearch-project/opensearch");

const app = express();
app.use(express.json());

console.log("running test");

// Serve static files (index.html)
app.use(express.static("public"));

// Initialize OpenSearch client
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

console.log(client);

client
    .search({
        index: "paintings",
        body: {
            query: {
                match_all: {},
            },
            size: 2,
        },
    })
    .then((response) => {
        console.log("🎨 Documents in 'paintings' index:");
        response.body.hits.hits.forEach((hit, i) => {
            console.log(`${i + 1}.`, hit._source);
        });
    })
    .catch((error) => {
        console.error("❌ Error fetching documents:", error);
    });

client
    .search({
        index: "masks",
        body: {
            query: {
                match_all: {},
            },
            size: 2,
        },
    })
    .then((response) => {
        console.log("🎨 Documents in 'paintings' index:");
        response.body.hits.hits.forEach((hit, i) => {
            console.log(`${i + 1}.`, hit._source);
        });
    })
    .catch((error) => {
        console.error("❌ Error fetching documents:", error);
    });

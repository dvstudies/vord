const { Client } = require("@opensearch-project/opensearch");

// Initialize OpenSearch client
const client = new Client({ node: "http://localhost:9200" });

async function getRenaissancePaintings() {
    try {
        const response = await client.search({
            index: "paintings",
            body: {
                query: {
                    match: { movement: "Renaissance" },
                },
            },
        });

        console.log("✅ Renaissance Paintings Found:");
        response.body.hits.hits.forEach((hit, index) => {
            console.log(
                `${index + 1}. ${hit._source.title} by ${hit._source.artist} (${
                    hit._source.year
                })`
            );
        });
    } catch (error) {
        console.error("❌ Error fetching Renaissance paintings:", error);
    }
}

// Run the query
getRenaissancePaintings();

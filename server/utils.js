export function buildOpenSearchFilter(clauses) {
    console.log("Building OpenSearch filter with clauses:", clauses);
    return clauses
        .map((clause) => {
            switch (clause.type) {
                case "sort":
                    return {
                        range: {
                            [clause.field]: {
                                ...(clause.min !== undefined && {
                                    gte: clause.min,
                                }),
                                ...(clause.max !== undefined && {
                                    lte: clause.max,
                                }),
                            },
                        },
                    };
                case "metaSearch":
                    return {
                        terms: {
                            [clause.field]: clause.cats,
                        },
                    };
                case "term":
                    return { term: { [clause.field]: clause.value } };
                case "exists":
                    return { exists: { field: clause.field } };
                case "geo":
                    return {
                        geo_bounding_box: {
                            [clause.field]: {
                                top_left: [clause.bbox[0], clause.bbox[3]],
                                bottom_right: [clause.bbox[2], clause.bbox[1]],
                            },
                        },
                    };
                default:
                    return null;
            }
        })
        .filter(Boolean); // remove nulls
}

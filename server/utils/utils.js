export function buildOpenSearchFilter(clauses) {
    if (!Array.isArray(clauses)) return null;

    return clauses
        .map((clause) => {
            switch (clause.type) {
                case "sort":
                    if (clause.min === undefined || clause.max === undefined) {
                        return null;
                    }
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
                    if (clause.field === undefined || clause.cats.length == 0) {
                        return null;
                    }
                    return {
                        terms: {
                            [clause.field]: clause.cats,
                        },
                    };

                case "pickChoose":
                    if (clause.field === undefined || clause.ids.length == 0) {
                        return null;
                    }
                    return {
                        terms: {
                            [clause.field]: clause.ids,
                        },
                    };

                case "colorWheel":
                    if (clause.field === undefined || clause.ids.length == 0) {
                        return null;
                    }
                    return {
                        terms: {
                            [clause.field]: clause.ids,
                        },
                    };

                case "imageSearch":
                case "semanticSearch":
                    if (clause.field === undefined || clause.ids.length == 0) {
                        return null;
                    }
                    return {
                        terms: {
                            [clause.field]: clause.ids,
                        },
                    };

                default:
                    return null;
            }
        })
        .filter(Boolean); // remove nulls
}

// case "term":
//     return { term: { [clause.field]: clause.value } };
// case "exists":
//     return { exists: { field: clause.field } };
// case "geo":
//     return {
//         geo_bounding_box: {
//             [clause.field]: {
//                 top_left: [clause.bbox[0], clause.bbox[3]],
//                 bottom_right: [clause.bbox[2], clause.bbox[1]],
//             },
//         },
//     };

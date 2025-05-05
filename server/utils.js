export function buildOpenSearchFilter(clauses) {
    console.log("Building OpenSearch filter with clauses:", clauses);

    if (!Array.isArray(clauses)) return null;

    // Prioritize `pickChoose` clauses if present and valid
    const pickChooseFilters = clauses
        .filter(
            (clause) =>
                clause.type === "pickChoose" &&
                clause.field &&
                Array.isArray(clause.ids) &&
                clause.ids.length > 0
        )
        .map((clause) => ({
            terms: {
                [clause.field]: clause.ids,
            },
        }));

    if (pickChooseFilters.length > 0) {
        console.log("Using only pickChoose filters:", pickChooseFilters);
        return pickChooseFilters;
    }

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

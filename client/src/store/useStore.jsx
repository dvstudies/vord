import { create } from "zustand";
import { actionBtns, columns } from "./config.jsx";
import { postBackend } from "../utils.js";

const filterSchema = {
    id: null, // the id of the filter
    component: null, // for storing the component to be rendered
    btn: null, // for storing the button info
    config: {}, // for storing pagers and other settings
    call: {}, // for storing the filtering call to the backend
    metadata: {}, // for storing in-component state
};

export let useStore = create((set, get) => ({
    actionBtns,
    columns,
    mainViewProperties: {},

    schema: null,
    actionsHistory: [],
    actionsSettings: {},
    dataHistory: {},

    actionActive: false,
    dbOn: false,

    // colors: colors,
    info: [
        "artwork_name",
        "artist_full_name",
        "source_url",
        "collection_origins",
        "century",
        "creation_year",
        "general_type",
        "school",
    ],
    // addBtn: (btn) => {
    //     const currentHistory = get().actionsHistory || [];
    //     const newHistory = [...currentHistory, btn];
    //     const id = newHistory.length; // Generate a unique ID for the new action
    //     set((state) => ({
    //         dbOn: false,
    //         actionsHistory: newHistory,
    //         actionsSettings: {
    //             ...state.actionsSettings,
    //             [id]: { ...btn, settings: {} }, // Initialize settings for the new action
    //         },
    //         dataHistory: {
    //             ...state.dataHistory,
    //             [id]: [], // Initialize settings for the new action
    //         },
    //         actionActive: newHistory.length,
    //     }));
    // },
    // setActionSettings: (id, settings) => {
    //     set((state) => ({
    //         actionsSettings: {
    //             ...state.actionsSettings,
    //             [id]: { ...state.actionsSettings[id], settings },
    //         },
    //     }));
    // },
    // setDataHistory: (id, data) => {
    //     set((state) => ({
    //         dataHistory: {
    //             ...state.dataHistory,
    //             [id]: data,
    //         },
    //     }));
    // },
    // setActive: (id) => {
    //     set(() => ({
    //         actionActive: id,
    //     }));
    // },

    filtersHistory: [
        // {
        //     id: null,
        //     component: null,
        //     btn: {},
        //     config: {},
        //     data: {},
        //     metadata: {},
        // },
    ],

    activeFilter: null,
    activeFilterId: null,

    sample: { in: null, out: null },

    indexes: [],
    activeIndex: null,

    clauses: [],

    setActiveFilter: (index) => {
        set(() => ({
            activeFilterId: index,
            activeFilter: get().filtersHistory[index],
        }));
    },

    addFilter: (btn) => {
        // const filter = {
        //     id: get().filtersHistory.length,
        //     component: btn.fn,
        //     btn,
        //     config: {},
        //     data: {},
        //     metadata: {},
        // };

        const filter = structuredClone(filterSchema);
        filter.id = get().filtersHistory.length;
        filter.component = btn.fn;
        filter.btn = btn;

        const clauses = get()
            .filtersHistory.slice(0, get().filtersHistory.length)
            .map((filter) => {
                const { call } = filter;
                return call;
            });

        set((state) => ({
            dbOn: false,
            filtersHistory: [...state.filtersHistory, filter],
            activeFilterId: state.filtersHistory.length,
            activeFilter: filter,
            clauses: clauses,
            activeCall: filter.call,
        }));
    },

    updateFilter: (id, updatedFilter) =>
        set((state) => {
            const newFilters = [...state.filtersHistory];
            newFilters[id] = { ...newFilters[id], ...updatedFilter };
            return {
                filtersHistory: newFilters,
                activeFilter: updatedFilter, // CHECK IF THIS IS BUGGY
                activeCall: updatedFilter.call,
            };
        }),

    removeLastFilter: () => {
        set((state) => {
            const newFiltersHistory = state.filtersHistory.slice(0, -1);
            const newActiveFilterId = newFiltersHistory.length - 1;

            return {
                filtersHistory: newFiltersHistory,
                activeFilterId:
                    newActiveFilterId >= 0 ? newActiveFilterId : null,
                activeFilter:
                    newActiveFilterId >= 0
                        ? newFiltersHistory[newActiveFilterId]
                        : null,
                activeCall:
                    newActiveFilterId >= 0
                        ? newFiltersHistory[newActiveFilterId].call
                        : null,
                clauses: newFiltersHistory.map((filter) => filter.call),
                sample: { in: null, out: null },
            };
        });
    },

    resetFilters: () => {
        set(() => ({
            filtersHistory: [],
            activeFilterId: null,
            activeFilter: null,
            activeCall: null,
            clauses: [],
            sample: { in: null, out: null },
        }));
    },

    runFilterCall: (currentFilter = null) => {
        const filtersHistory = [
            ...get().filtersHistory.slice(0, get().activeFilterId),
        ];

        const clauses = filtersHistory.map((filter) => {
            const { call } = filter;
            return call;
        });

        if (currentFilter) {
            clauses.push(currentFilter);
        }

        return postBackend("filter", {
            clauses: clauses,
        });
    },
}));

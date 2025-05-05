import { BACKEND_URL } from "./store/config";

export function remapNumber(value, inputRange, outputRange) {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;

    if (value < inputMin) return outputMin;
    if (value > inputMax) return outputMax;

    const inputSpan = inputMax - inputMin;
    const outputSpan = outputMax - outputMin;

    const scaledValue =
        ((value - inputMin) / inputSpan) * outputSpan + outputMin;
    return scaledValue;
}

export function randomColorDistance(color, n, distance) {
    const hexToHsv = (hex) => {
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const v = max;
        const d = max - min;
        const s = max === 0 ? 0 : d / max;
        let h = 0;
        if (max !== min) {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, v * 100];
    };

    const hsvToHex = (h, s, v) => {
        h /= 360;
        s /= 100;
        v /= 100;
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                (r = v), (g = t), (b = p);
                break;
            case 1:
                (r = q), (g = v), (b = p);
                break;
            case 2:
                (r = p), (g = v), (b = t);
                break;
            case 3:
                (r = p), (g = q), (b = v);
                break;
            case 4:
                (r = t), (g = p), (b = v);
                break;
            case 5:
                (r = v), (g = p), (b = q);
                break;
        }
        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const [h, s, v] = hexToHsv(color);
    const colors = [];
    for (let i = 0; i < n; i++) {
        const newH = (h + (Math.random() * 2 - 1) * distance + 360) % 360;
        colors.push(hsvToHex(newH, s, v));
    }
    return colors;
}
export function randomColor(color, n, distance) {}

export function opacifyColor(color, opacity) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    };

    return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export async function getBackend(path, queryParams = {}) {
    const url = new URL(`${BACKEND_URL}/vord/get/${path}`);

    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    return await res.json();
}

export async function postBackend(path, body = {}, method = "POST") {
    const url = `${BACKEND_URL}/vord/post/${path}`;

    console.log("POST URL:", url, "body", body);

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.json();
}

// //////////////////// utilites store
// import { useState, useEffect } from "react";

// export function usePersistedState(key, initialValue) {
//     const [state, setState] = useState(() => {
//         try {
//             const persisted = localStorage.getItem(key);
//             return persisted !== null ? JSON.parse(persisted) : initialValue;
//         } catch (error) {
//             console.error(`Error reading localStorage key "${key}":`, error);
//             return initialValue;
//         }
//     });

//     useEffect(() => {
//         try {
//             localStorage.setItem(key, JSON.stringify(state));
//         } catch (error) {
//             console.error(`Error setting localStorage key "${key}":`, error);
//         }
//     }, [key, state]);

//     return [state, setState];
// }

////////////////// utilities charts
import { scaleLinear } from "@visx/scale";

// Accessors
export const xAccessor = (d) => Number(d.value);
export const yAccessor = (d) => d.count;

// Domain calculator
export const getDomain = (data, xAccessor, yAccessor, fallback = [0, 10]) => {
    const xVals = data.map(xAccessor);
    const yVals = data.map(yAccessor);
    return [
        xVals.length ? Math.min(...xVals) : fallback[0],
        xVals.length ? Math.max(...xVals) : fallback[1],
        yVals.length ? Math.min(...yVals) : fallback[0],
        yVals.length ? Math.max(...yVals) : fallback[1],
    ];
};

// Chart layout hook
export const useChartLayout = (
    width,
    height,
    fullMinX,
    fullMaxX,
    fullMinY,
    fullMaxY,
    theme
) => {
    const brushHeight = 100;
    const chartHeight = height - brushHeight - 20;

    const brushMargin = {
        top: 0,
        bottom: theme.margin.bottom / 2,
        left: theme.margin.left,
        right: theme.margin.right,
    };

    const brushInnerWidth = width - brushMargin.left - brushMargin.right;
    const brushInnerHeight = brushHeight - brushMargin.top - brushMargin.bottom;

    const createScale = (min, max, range) =>
        scaleLinear({ domain: [min, max], range });

    return {
        brushHeight,
        chartHeight,
        brushMargin,
        brushXScale: createScale(fullMinX, fullMaxX, [0, brushInnerWidth]),
        brushYScale: createScale(fullMinY, fullMaxY, [brushInnerHeight, 0]),
        brushInnerWidth,
        brushInnerHeight,
    };
};

// import Papa from "papaparse";

// export async function loadCSVData(filePath, header = false) {
//     return new Promise((resolve, reject) => {
//         Papa.parse(filePath, {
//             download: true,
//             header: header,
//             skipEmptyLines: true,
//             dynamicTyping: true,

//             complete: (result) => {
//                 if (result.data) {
//                     resolve(result.data);
//                 } else {
//                     reject(new Error("Failed to parse CSV file."));
//                 }
//             },
//             error: (error) => {
//                 reject(error);
//             },
//         });
//     });
// }

// export function sortParallellyArr(sortingArr, sortedArr) {
//     const ix = sortingArr.map((x, i) => i);
//     ix.sort((a, b) => sortingArr[a] - sortingArr[b]);
//     sortingArr = ix.map((x) => sortingArr[x]);
//     sortedArr = ix.map((x) => sortedArr[x]);

//     return [sortingArr, sortedArr];
// }

export function hexToHsv(hex) {
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    (r /= 255), (g /= 255), (b /= 255);
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, v * 100];
}

// export function randomColors(amount) {
//     const randomColors = [];
//     const letters = "0123456789ABCDEF";

//     for (let i = 0; i < amount; i++) {
//         let color = "#";
//         for (let j = 0; j < 6; j++) {
//             color += letters[Math.floor(Math.random() * 16)];
//         }
//         randomColors.push(color);
//     }
//     return randomColors;
// }

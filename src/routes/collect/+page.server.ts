import type { PageServerLoad } from './$types';
import * as d3 from "d3";
import type {IStateWrapper} from "$lib/ITopics";
import {parse} from "yaml";
import {PUBLIC_STATE} from "$env/static/public";

// Retrieve data from the store
async function fetchData(fetch: any, product: string) {
    const csvReq = await fetch(`https://blzaiext.blob.core.windows.net/prices/${product}`);
    const reqData = await csvReq.text();
    const csvData = d3.csvParseRows(reqData);
    const data = csvData.map((row) => ({
        product: product,
        date: new Date(row[2]),
        price: Math.floor(+row[1] / 100)
    }));
    // Find Max
    const maxY = d3.max(data, (d) => d.price) || 0;
    // Update plot
    return {data: data, maxY: maxY};
}

export const load: PageServerLoad = async ({ fetch, params }) => {
    console.log("load")
    const base: IStateWrapper = parse(PUBLIC_STATE);
    const productsList = base.cards.products;

    // Fetch data for each product
    const dataGroups: {data: any, maxY: number}[] = [];
    for (const product of productsList) {
        dataGroups.push(await fetchData(fetch, product));
    }
    // Join all data
    const summaryData = [];
    for (const dataGroup of dataGroups) {
        summaryData.push(...dataGroup.data);
    }

    return {
        props: {
            productsList,
            dataGroups,
            summaryData
        }
    };
}

export interface CollectPage {
    productsList: string[];
    dataGroups: {data: any, maxY: number}[];
    summaryData: any;
}

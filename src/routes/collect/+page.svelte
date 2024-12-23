<script lang="ts">
    import * as Plot from '@observablehq/plot';
    import * as d3 from 'd3';
    import {onMount} from "svelte";
    import type {IStateWrapper} from "$lib/ITopics";
    import {parse} from "yaml";
    import {PUBLIC_STATE} from "$env/static/public";
    import type { PageData } from './$types';
    import type {CollectPage} from "./+page.server";

    let { data }: { data: PageData } = $props();
    const base: IStateWrapper = parse(PUBLIC_STATE);
    const products = base.cards.products;

    let normalizedDiv: HTMLElement;
    let divs: HTMLElement[] = [];

    function showSummary(data: { title: string, data: any }[]) {
        normalizedDiv.firstChild?.remove();
        const plot = Plot.plot({
            color: {
                scheme: "spectral",
                legend: true
            },
            style: "overflow: visible;",
            y: {
                type: "log",
                grid: true,
                label: "Change in price (%)",
                tickFormat: ((f) => (x) => f((x - 1) * 100))(d3.format("+d"))
            },
            marks: [
                Plot.ruleY([1]),
                Plot.line(data, Plot.normalizeY({
                    x: "date",
                    y: "price",
                    stroke: "product"
                }))
            ]
        })
        normalizedDiv.appendChild(plot);
    }

    function updatePlot(data: { date: Date; price: number }[], index: number, title: string, maxY: number = 0) {
        if (maxY === 0) {
            maxY = d3.max(data, (d) => d.price) || 0;
        }
        if (divs[index]) {
            divs[index].firstChild?.remove(); // remove old chart, if any
            const plot = Plot.plot({
                title: title,
                grid: true,
                y: {domain: [0, maxY + (Math.floor(maxY * 0.1))]},
                insetLeft: 10,
                insetRight: 10,
                insetBottom: 10,
                insetTop: 10,
                marks: [
                    Plot.ruleY([0]),
                    Plot.axisX({label: 'Date'}),
                    Plot.axisY({label: 'Price'}),
                    Plot.lineY(data, { x: 'date', y: 'price' }),
                ]});
            divs[index].appendChild(plot);
        }
    }

    onMount(() => {
        const localData = data.props as CollectPage;
        showSummary(localData.summaryData);
        localData.dataGroups.forEach((dataGroup, index) => {
            console.log(dataGroup.data);
            updatePlot(dataGroup.data, index, products[index], dataGroup.maxY);
        });
    });

</script>

<style>
    .graphs-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        overflow-x: auto;
    }
    .summary-graph {
        margin: 1%;
    }
    .graph {
        margin: 1%;
        flex: 1 1 calc(33.33% - 2%);
        max-width: calc(33.33% - 2%);
    }
    @media (max-width: 768px) {
        .graph {
            flex: 1 1 100%;
            max-width: 100%;
            margin: 1%;
        }
    }
    .summary-graphs-container{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: auto;
    }
</style>

<div class="summary-graphs-container">
    <div bind:this={normalizedDiv} class="summary-graph" role="img"></div>
</div>

<div class="graphs-container">
    {#each products as _, index}
        <div class="graph" bind:this={divs[index]} role="img"></div>
    {/each}
</div>
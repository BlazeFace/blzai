<script lang="ts">
     import { PUBLIC_STATE } from '$env/static/public';
     import type {TopicPage} from "./+page";
     import {parse} from "yaml";
     import type {IStateWrapper} from "$lib/ITopics";

     export let data:TopicPage;

     const base: IStateWrapper = parse(PUBLIC_STATE);
     const photos = base.photos[data.name];
</script>
<h1 class="text-3xl text-center underline">{data.name}</h1>
<div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
        {#each photos as photo}
            <div class="flex flex-wrap md:w-1/4 w-1/2">
                <div class="w-full p-1 md:p-2">
                    <img alt="gallery" class="block object-cover object-center w-full h-full rounded-lg"
                         src="{photo}"/>
                </div>
            </div>
        {/each}
    </div>
</div>
<style>
    /* styles go here */
</style>
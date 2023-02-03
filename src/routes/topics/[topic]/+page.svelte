<script lang="ts">
     import { PUBLIC_STATE } from '$env/static/public';
     import type {TopicPage} from "./+page";
     import {parse} from "yaml";
     import type {IStateWrapper} from "$lib/ITopics";
     import {crossfade, fade} from "svelte/transition";

     export let data:TopicPage;
     // Handle Image Expand
     let selected = '';
     const [send, receive] = crossfade({
         duration: () => 350,
         fallback: fade,
     });

     const handlePreviewClick = (imageURL) => {
         selected = imageURL;
     }
     // State
     const base: IStateWrapper = parse(PUBLIC_STATE);
     const photos = base.photos[data.name];
</script>
<style>
    .image-viewer {
        padding: 20px;
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        background-color: rgba(100, 100, 100, 0.8);
    }
    .image {
        width: 100%;
        height: 200px;
        background: center / cover no-repeat;
    }
</style>

<h1 class="text-3xl text-center underline">{data.name}</h1>
<div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
        {#each photos as photo}
            <div class="flex flex-wrap md:w-1/4 w-1/2">
                <div class="w-full p-1 md:p-2">
                    {#if photo !== selected}
                        <div role="img" aria-label="photo" out:send={{key:photo}} in:receive={{key: photo}}
                             on:click={() => handlePreviewClick(photo)} class="image"
                             style="background-image: url({photo.concat('ThreeByTwo')});"></div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    {#if selected}
        <div class="image-viewer" on:click={(e) => {
        if (e.target === e.currentTarget) {
	    selected = ''
	    }
    }}>
        <img in:receive={{key:selected}} out:send={{key: selected}} src="{selected.concat('public')}" />
        </div>
    {/if}

</div>

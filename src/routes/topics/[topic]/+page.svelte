<script lang="ts">
     import { PUBLIC_STATE } from '$env/static/public';
     import type {TopicPage} from "./+page";
     import {parse} from "yaml";
     import type {IStateWrapper} from "$lib/ITopics";
     import {crossfade} from "svelte/transition";

     export let data: TopicPage;
     // Handle Image Expand
     let selected = '';
     const [send, receive] = crossfade({
         duration: () => 350
     });

     const handlePreviewClick = (imageURL: string) => {
         selected = imageURL;
     }
     // State
     const base: IStateWrapper = parse(PUBLIC_STATE);
     const cdn = base.global.cdn;
     base.photos = new Map(Object.entries(base.photos));

     const photos = base.photos.get(data.name) ?? []
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
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .image {
        width: 100%;
        height: 200px;
        background: center / cover no-repeat;
    }
    .image-viewer img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #fff;
        color: oklch(var(--p));
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
    }
</style>
<h1 class="text-3xl text-center text-accent">{data.name}</h1>
<div class="flex items-center justify-center mt-1 underline">
    <a class= "text-l text-center" href="/topics">Back to Portfolio</a>
</div>
<div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
        {#each photos as photoId}
            <div class="flex flex-wrap md:w-1/4 w-1/2">
                <div class="w-full p-1 md:p-2">
                    {#if photoId !== selected}
                        <div role="button" tabindex="0" aria-label="Expandable image" out:send={{key:photoId}} in:receive={{key: photoId}}
                             on:click={() => handlePreviewClick(photoId)} on:keydown={() => handlePreviewClick(photoId)} class="image"
                             style="background-image: url({`${cdn}preview_${photoId}.avif`});"></div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    {#if selected}
        <div class="image-viewer" role="button" tabindex="0"
             on:click={(e) => { if (e.target === e.currentTarget) { selected = '' } }}
             on:keydown={(e) => { if (e.target === e.currentTarget) { selected = '' } }}
        >
            <button class="close-button" on:click={() => { selected = '' }}>x</button>
            <img alt = 'Feature to support caption for each is being worked on' in:receive={{key:selected}} out:send={{key: selected}} src="{`${cdn}full_${selected}.avif`}" />
        </div>
    {/if}
</div>
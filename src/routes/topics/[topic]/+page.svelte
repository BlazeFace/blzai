<script lang="ts">
     import { PUBLIC_STATE } from '$env/static/public';
     import type {TopicPage} from "./+page";
     import {parse} from "yaml";
     import type {IStateWrapper} from "$lib/ITopics";
     import {crossfade} from "svelte/transition";

     export let data:TopicPage;
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
    }
    .image {
        width: 100%;
        height: 200px;
        background: center / cover no-repeat;
    }
</style>
<h1 class="text-3xl text-center text-accent">{data.name}</h1>
<div class="flex items-center justify-center mt-1 underline">
    <a class= "text-l text-center" href="/topics">Back to Portfolio</a>
</div>
<div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
        {#each photos as photo}
            <div class="flex flex-wrap md:w-1/4 w-1/2">
                <div class="w-full p-1 md:p-2">
                    {#if photo !== selected}
                        <div role="button" tabindex="0" aria-label="Expandable image" out:send={{key:photo}} in:receive={{key: photo}}
                             on:click={() => handlePreviewClick(photo)} on:keydown={() => handlePreviewClick(photo)} class="image"
                             style="background-image: url({photo.concat('ThreeByTwo')});"></div>
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
        <img alt = 'Feature to support caption for each is being worked on' in:receive={{key:selected}} out:send={{key: selected}} src="{selected.concat('public')}" />
        </div>
    {/if}

</div>
<script lang="ts">
    import type {IPhoto, } from '$lib/IPhoto';

    const photos: IPhoto[] = [
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/2d440018-b662-48ac-7f1d-7ae3b7466200/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/aed20741-37da-4937-ccff-bf83c51e2000/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/2d440018-b662-48ac-7f1d-7ae3b7466200/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/aed20741-37da-4937-ccff-bf83c51e2000/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/2d440018-b662-48ac-7f1d-7ae3b7466200/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/aed20741-37da-4937-ccff-bf83c51e2000/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/2d440018-b662-48ac-7f1d-7ae3b7466200/ThreeByTwo',
            alt: 'Test'
        },
        {
            url: 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/aed20741-37da-4937-ccff-bf83c51e2000/ThreeByTwo',
            alt: 'Test'
        }
    ]
</script>

<!-- markup (zero or more items) goes here -->
<div class="px-2">
    <div class="container grid grid-cols-8 grid-flow-row gap-1 mx-auto">
        {#each photos as photo}

                <div class="col-span-2 w-full">
                    <img src="{photo.url}" alt="{photo.alt}"/>
                </div>
        {/each}
    </div>
</div>
<style>
    /* styles go here */
</style>
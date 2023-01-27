<script lang="ts">
    import type {IPhoto,} from '$lib/IPhoto';
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

<div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
        {#each photos as photo}
            <div class="flex flex-wrap md:w-1/4 w-1/2">
                <div class="w-full p-1 md:p-2">
                    <img alt="gallery" class="block object-cover object-center w-full h-full rounded-lg"
                         src="{photo.url}"/>
                </div>
            </div>
        {/each}
    </div>
</div>
<style>
    /* styles go here */
</style>
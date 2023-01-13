<script>
    let photos = ['https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/2d440018-b662-48ac-7f1d-7ae3b7466200/public', 'https://imagedelivery.net/AKukteFqX2KcRIgzKa8xOw/aed20741-37da-4937-ccff-bf83c51e2000/public']
</script>

<!-- markup (zero or more items) goes here -->
<div class="px-2">
    <div class="contain mx-auto">
        {#each photos as photo}
            <div class="carousel-item h-full">
                <figure>
                    <img src="{photo}" alt="" height="100px" width="200px">
                </figure>
            </div>
            {/each}
    </div>
</div>
<style>
    /* styles go here */
</style>
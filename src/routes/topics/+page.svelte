<script lang="ts">
    import { PUBLIC_STATE } from '$env/static/public';
    import {parse} from 'yaml';
    import type {IStateWrapper} from "$lib/ITopics";

    const base: IStateWrapper = parse(PUBLIC_STATE);
    const topics = base.topics;
</script>

<main>
<div class="container mx-auto">
    <div class="grid grid-cols-3">
        <div></div>
        <div>
            {#each topics as topic}
                <div class="divider text-left text-primary">{topic.topic}</div>
                <ul>
                    {#each topic.subtopics as subtopic}
                        <li>
                            <a href="/topics/{subtopic}" class="text-accent">{subtopic}</a>
                        </li>
                    {/each}
                </ul>
            {/each}
        </div>
    </div>
</div>
</main>
<style>

</style>
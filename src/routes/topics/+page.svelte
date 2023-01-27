<script lang="ts">
    import { PUBLIC_STATE } from '$env/static/public';
    import {parse} from 'yaml';

    export const prerender = true;
    /*
    const topics: ITopics[] = [
        {
            topic: 'Wildlife',
            subtopics: ['Birds']
        },
        {
            topic: 'Landscapes',
            subtopics: ['Sunsets', 'Mountains']
        },
        {
            topic: 'City',
            subtopics: ['Seattle', 'Other Places']
        },
        {
            topic: 'People',
            subtopics: ['Portraits']
        }];

     */
    const base = parse(PUBLIC_STATE);
    const topics = base.topics;
</script>

<div class="container mx-auto">
    <div class="grid grid-cols-3">
        <div></div>
        <div>
            {#each topics as topic}
                <div class="divider text-left text-primary">{topic.topic}</div>
                <ul>
                    {#each topic.subtopics as subtopic}
                        <li>
                            <a href="/topics/wild" class="text-accent">{subtopic}</a>
                        </li>
                    {/each}
                </ul>
            {/each}
        </div>
    </div>
</div>

<style>

</style>
<script>
    import { Icon, PaperAirplane } from 'svelte-hero-icons';
    import Ad from '$lib/components/Ad.svelte'
    export let data;
    console.log(data);

    let article;
    async function onload() {
        fetch(`/api/articles?article_id=${data.articleId}`)
            .then(res => res.json())
            .then(d => {
                article = d;
            });
        render_comments();
    }

    // ---- Comments ----
    let comment = ''; // content of the new comment
    let comments = [];

    async function render_comments() {
        fetch(`/api/articles/comment?article_id=${data.articleId}`)
            .then(res => res.json())
            .then(data => {
                comments = data;
            });
    }

    async function add_comment() {
        fetch('/api/articles/comment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                contributer: data.auth.username,
                article_id: data.articleId,
                comment: comment,
            })
        }).then(res => {
            render_comments();
            comment = '';
        });
    }
</script>

<div use:onload class="container mx-auto flex justify-center my-5 space-y-10 flex-col">
    {#if article}
        <div class="card p-10 flex">
            <div class="w-full">
                <header class="card-header">
                    <h1 class="h1">{article.title}</h1>
                </header>
                <section class="p-4">{article.body}</section>
            </div>
            <img class="w-36 h-36" src="/fsh.png" alt="fsh.png">
        </div>

        <!-- non-headline articles + ad -->
        <div class="flex space-x-10 justify-between">
            <!-- other articles -->
            <!--
            <div class="space-y-4 w-full">
                {#each articles.slice(1) as article, i }
                <div class="card card-hover p-2 w-full">
                    <section class="p-3"><strong>{article.title}</strong> | {article.teaser}</section>
                </div>
                {/each}
            </div>
            -->

            <div class="space-y-2 w-full">
                {#if data.auth }
                <h2 class="h2">Comments</h2>
                <!-- Comment field -->
                <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                    <input type="text" placeholder="Comment..." bind:value={comment} />
                    <button class="variant-filled-primary" on:click={add_comment}><Icon size="32" src={PaperAirplane} /></button>
                    <input type="submit" hidden />
                </div>

                <!-- Comment list -->
                <div class="card">
                    {#each comments as c, i }
                    <div class="p-2 w-full">
                        <section class="p-3">
                            <p><strong>{c.contributer}</strong></p>
                            {c.comment}
                        </section>
                    </div>
                    {/each}
                </div>
                {/if}
            </div>

            <!-- Ads -->
            <div class="w-64">
                {#if data.auth && data.auth.role === "author"}
                    <a href="/edit/{data.articleId}" class="btn variant-filled-primary">Edit Article</a>
                {:else}
                    <Ad />
                {/if}
            </div>
        </div>
    {/if}
</div>

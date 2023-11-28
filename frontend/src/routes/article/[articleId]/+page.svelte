<script>
    import { Icon, PaperAirplane } from 'svelte-hero-icons';
    import Ad from '$lib/components/Ad.svelte'
    const articles = [
        {
            'id': '0',
            'title': 'a title',
            'teaser': 'this is a teaser',
            'author': 'Chase',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h',
            'date_modified': '12/3/2023',
        },
        {
            'id': '1',
            'title': 'a title 1',
            'teaser': 'this is a teaser 1',
            'author': 'Chase 1',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h 1',
            'date_modified': '12/3/2023 1',
        },
        {
            'id': '2',
            'title': 'a title 2',
            'teaser': 'this is a teaser 2',
            'author': 'Chase 2',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h 2',
            'date_modified': '12/3/2023 2',
        },
        {
            'id': '3',
            'title': 'a title 3',
            'teaser': 'this is a teaser 3',
            'author': 'Chase 3',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h 3',
            'date_modified': '12/3/2023 3',
        },
    ];
    export let data;
    console.log(data);
    const article = articles[data.articleId];


    // ---- Comments ----
    let comment = ''; // content of the new comment

    let comments = [
            {'contributer': 'neil', 'comment': 'arsoitnawfotyafw hatwihufwtula wfihulawihult aihulfthi ula'},
            {'contributer': 'neil', 'comment': 'arsoitnawfotyafw hatwihufwtula wfihulawihult aihulfthi ula'},
            {'contributer': 'neil', 'comment': 'arsoitnawfotyafw hatwihufwtula wfihulawihult aihulfthi ula'},
    ];

    function render_comments() {
        fetch(`/api/articles/comment?article_id=${article.id}`)
            .then(res => res.json())
            .then(data => {
                comments = data;
            });
    }

    function add_comment() {
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

<div class="container mx-auto flex justify-center my-5 space-y-10 flex-col">
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
                <h2 class="h2">Comments</h2>
                <!-- Comment field -->
                <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                    <input type="text" placeholder="Comment..." bind:value={comment} />
                    <button class="variant-filled-primary" on:click={add_comment}><Icon size="32" src={PaperAirplane} /></button>
                    <input type="submit" hidden />
                </div>

                <!-- Comment list -->
                <div use:render_comments class="card">
                    {#each comments as c, i }
                    <div class="p-2 w-full">
                        <section class="p-3">
                            <p><strong>{c.contributer}</strong></p>
                            {c.comment}
                        </section>
                    </div>
                    {/each}
                </div>
            </div>

            <!-- Ads -->
            <div class="w-64">
                <Ad />
            </div>
        </div>
</div>

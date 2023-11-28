<script>
    import Ad from '$lib/components/Ad.svelte'
    let articles;

    function onload() {
        fetch('/api/articles')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                articles = data;
            });
    }
</script>

<div use:onload class="container mx-auto flex justify-center my-5 space-y-10 flex-col">
    {#if articles}
    <a style="display: block;" href="/article/{articles[0]._id}">
        <div class="card card-hover p-10 flex">
            <div class="w-full">
                <header class="card-header">
                    <h1 class="h1">{articles[0].title}</h1>
                </header>
                <section class="p-4">{articles[0].body}</section>
            </div>
            <img class="w-36 h-36" src="/fsh.png" alt="">
        </div>
    </a>

    <!-- non-headline articles + ad -->
    <div class="flex space-x-10 justify-between">
        <div class="space-y-8 w-full">
            {#each articles.splice(1) as article, i }
            <a style="display: block;" href="/article/{article._id}">
                <div class="card card-hover p-5 w-full">
                    <header class="card-header">
                        <h3 class="h3">{article.title}</h3>
                    </header>
                    <section class="p-4">{article.teaser}</section>
                </div>
            </a>
            {/each}
        </div>
        <div class="w-64 space-y-8">
            <Ad />
        </div>
    </div>
    {/if}
</div>

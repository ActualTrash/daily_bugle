<script>
    export let data;

    let title = '';
    let teaser = '';
    let body = '';

    async function add_article() {
        fetch('/api/articles', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title: title,
                teaser: teaser,
                author: data.auth.username,
                body: body,
            })
        });
    }
</script>

<div class="container mx-auto flex justify-center my-5 space-y-8 flex-col">
    <form action="" class="card p-5 space-y-8 flex-col">
        <label class="label">
	<span>Title</span>
            <input class="input my-5" title="Teaser" type="text" bind:value={title} />
        </label>

        <label class="label">
	<span>Teaser</span>
            <input class="input my-5" title="Teaser" type="text" bind:value={teaser} />
        </label>

        <label class="label">
	<span>Article Body</span>
            <textarea class="textarea" rows="4" placeholder="Write your story here..." bind:value={body} />
        </label>

        <button class="btn variant-filled-primary" on:click={add_article}>Create Article</button>
    </form>
</div>

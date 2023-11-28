<script>
    import { redirect } from '@sveltejs/kit';
    export let data;

    let title = '';
    let teaser = '';
    let body = '';

    async function onload() {
        fetch(`/api/articles?article_id=${data.articleId}`)
            .then(res => res.json())
            .then(d => {
                title = d.title || '';
                teaser = d.teaser || '';
                body = d.body || '';
            });
    }

    async function update_article() {
        fetch('/api/articles', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                _id: data.articleId,
                title: title,
                teaser: teaser,
                author: data.auth.username,
                body: body,
            })
        }).then(res => res.json())
        .then(d => {
                console.log(d);
        });
    }
</script>

<div use:onload class="container mx-auto flex justify-center my-5 space-y-8 flex-col">
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

        <a href="/article/{data.articleId}" class="btn variant-filled-danger">Back</a>
        <button class="btn variant-filled-primary" on:click={update_article}>Save</button>
    </form>
</div>

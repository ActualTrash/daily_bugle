<script lang="ts">
    export let article_id: String = 'none';
    let src: String = '';
    let ad_id: String = '';

    function onload() {
        src = '/fsh.png';
        fetch('/api/ads/ad')
        .then(res => res.json())
        .then(data => {
            ad_id = data._id;
            ad_path = data.alt;
        });
    }

    function handleClick() {
        if ( ad_id ) {
            let user = 'anonymous';
            fetch(`/api/ads/adclick?ad_id=${ad_id}&user_id=${user}&article_id=${article_id}`);
        } else {
            console.log('Ad clicked, but it is undefined!');
        }
    }
</script>

<img use:onload {src} alt="ad" on:click={handleClick} />
<small>Advertisement</small>

<!--
<div class="card" on:click={handleClick}>
	<header class="card-header">(header)</header>
	<section class="p-4">(content)</section>
	<footer class="card-footer">(footer)</footer>
</div> -->

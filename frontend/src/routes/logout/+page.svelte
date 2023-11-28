<script>
    const thisPage = window.location.pathname;

    console.log('goto ' + thisPage);

    goto('/').then(
        () => goto(thisPage)
    );
</script>

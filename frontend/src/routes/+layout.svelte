<script lang="ts">
    import '../app.postcss';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup, AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    const auth_token = '';
    const username = 'Username error';

    export let data;
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
            <svelte:fragment slot="lead">
                <div>
            </svelte:fragment>
            <a href="/">
                <h1 class="font-bold btn rounded-md h1">The Daily Bugle</h1>
            </a>
            <svelte:fragment slot="trail">
                <LightSwitch />
                {#if data.auth !== null}
                    <p>Welcome {data.auth.username}</p>
                    <a href="/logout" class="btn variant-filled">Logout</a>
                {:else}
                    <a href="/login" class="btn variant-filled">Login</a>
                {/if}
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <slot />
</AppShell>

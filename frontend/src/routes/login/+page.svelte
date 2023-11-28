<script>
    import { focusTrap } from '@skeletonlabs/skeleton';
    import { enhance } from '$app/forms';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <form action="/login" method="POST" class="card p-4 text-token space-y-4" use:focusTrap={true} use:enhance>
            <label class="label">
                    <span>Username</span>
                    <input name="username" class="input" type="text" placeholder="" />
            </label>
            <label class="label">
                    <span>Password</span>
                    <input name="password" class="input" type="password" placeholder="" />
            </label>
            <button class="btn variant-filled-primary">Login</button>
    </form>
</div>

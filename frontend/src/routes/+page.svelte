<script>
    const articles = [
        {
            'title': 'a title',
            'teaser': 'this is a teaser',
            'author': 'Chase',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h',
            'date_modified': '12/3/2023',
        },
        {
            'title': 'a title 1',
            'teaser': 'this is a teaser 1',
            'author': 'Chase 1',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h 1',
            'date_modified': '12/3/2023 1',
        },
        {
            'title': 'a title 2',
            'teaser': 'this is a teaser 2',
            'author': 'Chase 2',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h 2',
            'date_modified': '12/3/2023 2',
        },
        {
            'title': 'a title 3',
            'teaser': 'this is a teaser 3',
            'author': 'Chase 3',
            'body': 'lorum arstoinaftyuafw ilhuafwihut fauiwufht h 3',
            'date_modified': '12/3/2023 3',
        },
    ];
    // fetch('');
</script>

<div class="container mx-auto flex justify-center my-5 space-y-10 flex-col">
        <div class="card card-hover p-10 flex">
            <div class="w-full">
                <header class="card-header">
                    <h1 class="h1">{articles[0].title}</h1>
                </header>
                <section class="p-4">{articles[0].teaser}</section>
            </div>
            <img class="w-36 h-36" src="fsh.png">
        </div>

        <!-- non-headline articles + ad -->
        <div class="flex space-x-10 justify-between">
            <div class="space-y-8 w-full">
                {#each articles.slice(1) as article, i }
                <div class="card card-hover p-5 w-full">
                    <header class="card-header">
                        <h3 class="h3">{article.title}</h3>
                    </header>
                    <section class="p-4">{article.teaser}</section>
                </div>
                {/each}
            </div>
            <div class="w-64">
                <div class="card">
                    aroisetn
                </div>
            </div>
        </div>
</div>

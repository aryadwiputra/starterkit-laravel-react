<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="app-name" content="{{ settings('app.name', config('app.name', 'Laravel')) }}">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css'])

        <title>{{ $title ?? settings('app.name', config('app.name', 'Laravel')) }}</title>
    </head>
    <body class="font-sans antialiased">
        <div class="flex min-h-screen items-center justify-center p-6">
            <div class="mx-auto w-full max-w-lg rounded-xl border bg-background p-6 shadow-sm">
                <div class="space-y-2">
                    <div class="text-xs font-medium text-muted-foreground">{{ $code ?? '' }}</div>
                    <h1 class="text-xl font-semibold tracking-tight">{{ $title ?? '' }}</h1>
                    @if(!empty($description))
                        <p class="text-sm text-muted-foreground">{{ $description }}</p>
                    @endif
                </div>

                <div class="mt-6 flex flex-wrap gap-2">
                    {{ $slot }}
                </div>
            </div>
        </div>
    </body>
</html>


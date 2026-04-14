@php
    $code = 500;
    $title = __('errors.500.title');
    $description = __('errors.500.description');
@endphp

@component('errors._layout', compact('code', 'title', 'description'))
    <a href="{{ url()->current() }}"
       class="inline-flex h-9 items-center justify-center rounded-md border border-black/40 bg-transparent px-4 text-sm font-medium text-foreground transition-all hover:opacity-80 active:opacity-70 dark:border-white/40">
        {{ __('errors.actions.reload') }}
    </a>

    <a href="{{ route(auth()->check() ? 'dashboard' : 'home') }}"
       class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        {{ auth()->check() ? __('errors.actions.dashboard') : __('errors.actions.home') }}
    </a>
@endcomponent


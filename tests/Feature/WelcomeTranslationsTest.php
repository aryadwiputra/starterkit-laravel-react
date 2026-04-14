<?php

test('landing page includes required translation modules', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('translations.common')
            ->has('translations.welcome')
            ->has('translations.auth')
        );
});

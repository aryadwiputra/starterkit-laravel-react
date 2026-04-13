import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/mail',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::edit
* @see app/Http/Controllers/Settings/MailSettingsController.php:21
* @route '/settings/mail'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::update
* @see app/Http/Controllers/Settings/MailSettingsController.php:58
* @route '/settings/mail'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/mail',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::update
* @see app/Http/Controllers/Settings/MailSettingsController.php:58
* @route '/settings/mail'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::update
* @see app/Http/Controllers/Settings/MailSettingsController.php:58
* @route '/settings/mail'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::update
* @see app/Http/Controllers/Settings/MailSettingsController.php:58
* @route '/settings/mail'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::update
* @see app/Http/Controllers/Settings/MailSettingsController.php:58
* @route '/settings/mail'
*/
updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::test
* @see app/Http/Controllers/Settings/MailSettingsController.php:118
* @route '/settings/mail/test'
*/
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/settings/mail/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::test
* @see app/Http/Controllers/Settings/MailSettingsController.php:118
* @route '/settings/mail/test'
*/
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::test
* @see app/Http/Controllers/Settings/MailSettingsController.php:118
* @route '/settings/mail/test'
*/
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::test
* @see app/Http/Controllers/Settings/MailSettingsController.php:118
* @route '/settings/mail/test'
*/
const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\MailSettingsController::test
* @see app/Http/Controllers/Settings/MailSettingsController.php:118
* @route '/settings/mail/test'
*/
testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
})

test.form = testForm

const MailSettingsController = { edit, update, test }

export default MailSettingsController
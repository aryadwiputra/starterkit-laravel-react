import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/app',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::edit
* @see app/Http/Controllers/Settings/AppSettingsController.php:19
* @route '/settings/app'
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
* @see \App\Http\Controllers\Settings\AppSettingsController::update
* @see app/Http/Controllers/Settings/AppSettingsController.php:41
* @route '/settings/app'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/app',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::update
* @see app/Http/Controllers/Settings/AppSettingsController.php:41
* @route '/settings/app'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::update
* @see app/Http/Controllers/Settings/AppSettingsController.php:41
* @route '/settings/app'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AppSettingsController::update
* @see app/Http/Controllers/Settings/AppSettingsController.php:41
* @route '/settings/app'
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
* @see \App\Http\Controllers\Settings\AppSettingsController::update
* @see app/Http/Controllers/Settings/AppSettingsController.php:41
* @route '/settings/app'
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

const AppSettingsController = { edit, update }

export default AppSettingsController
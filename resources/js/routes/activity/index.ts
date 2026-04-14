import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ActivityLogController::index
* @see app/Http/Controllers/Settings/ActivityLogController.php:19
* @route '/settings/activity'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const activity = {
    index: Object.assign(index, index),
}

export default activity
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::store
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:18
* @route '/api/v1/auth/tokens'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/auth/tokens',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::store
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:18
* @route '/api/v1/auth/tokens'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::store
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:18
* @route '/api/v1/auth/tokens'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::store
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:18
* @route '/api/v1/auth/tokens'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::store
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:18
* @route '/api/v1/auth/tokens'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroyCurrent
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
export const destroyCurrent = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCurrent.url(options),
    method: 'delete',
})

destroyCurrent.definition = {
    methods: ["delete"],
    url: '/api/v1/auth/tokens/current',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroyCurrent
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
destroyCurrent.url = (options?: RouteQueryOptions) => {
    return destroyCurrent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroyCurrent
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
destroyCurrent.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCurrent.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroyCurrent
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
const destroyCurrentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyCurrent.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroyCurrent
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
destroyCurrentForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyCurrent.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyCurrent.form = destroyCurrentForm

const tokens = {
    store: Object.assign(store, store),
    destroyCurrent: Object.assign(destroyCurrent, destroyCurrent),
}

export default tokens
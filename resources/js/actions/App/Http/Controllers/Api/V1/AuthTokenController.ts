import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroy
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/auth/tokens/current',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroy
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroy
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroy
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthTokenController::destroy
* @see app/Http/Controllers/Api/V1/AuthTokenController.php:41
* @route '/api/v1/auth/tokens/current'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AuthTokenController = { store, destroy }

export default AuthTokenController
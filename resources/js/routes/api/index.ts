import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\HealthController::__invoke
* @see app/Http/Controllers/Api/HealthController.php:17
* @route '/api/health'
*/
healthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

health.form = healthForm

const api = {
    health: Object.assign(health, health),
}

export default api
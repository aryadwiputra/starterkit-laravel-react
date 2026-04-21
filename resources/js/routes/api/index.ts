import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import v1 from './v1'
import docsA887e1 from './docs'
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

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
export const docs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})

docs.definition = {
    methods: ["get","head"],
    url: '/api/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
docs.url = (options?: RouteQueryOptions) => {
    return docs.definition.url + queryParams(options)
}

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
docs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
docs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: docs.url(options),
    method: 'head',
})

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
const docsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: docs.url(options),
    method: 'get',
})

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
docsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: docs.url(options),
    method: 'get',
})

/**
* @see routes/web.php:17
* @route '/api/docs'
*/
docsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: docs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

docs.form = docsForm

const api = {
    health: Object.assign(health, health),
    v1: Object.assign(v1, v1),
    docs: Object.assign(docs, docsA887e1),
}

export default api
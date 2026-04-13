import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
const RedirectControllerfc6874003af373efc88e5e18eecd9c17 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'get',
})

RedirectControllerfc6874003af373efc88e5e18eecd9c17.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/settings/profile',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.url = (options?: RouteQueryOptions) => {
    return RedirectControllerfc6874003af373efc88e5e18eecd9c17.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'head',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'put',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'delete',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'options',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
const RedirectControllerfc6874003af373efc88e5e18eecd9c17Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/profile'
*/
RedirectControllerfc6874003af373efc88e5e18eecd9c17Form.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerfc6874003af373efc88e5e18eecd9c17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'OPTIONS',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

RedirectControllerfc6874003af373efc88e5e18eecd9c17.form = RedirectControllerfc6874003af373efc88e5e18eecd9c17Form
/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
const RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'get',
})

RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/settings/security',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url = (options?: RouteQueryOptions) => {
    return RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'head',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'put',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'patch',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'delete',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'options',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
const RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url(options),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \Illuminate\Routing\RedirectController::__invoke
* @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
* @route '/settings/security'
*/
RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'OPTIONS',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0.form = RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0Form

const RedirectController = {
    '/settings/profile': RedirectControllerfc6874003af373efc88e5e18eecd9c17,
    '/settings/security': RedirectControllerff0bf73dc6d707afdea1fe4ef5ac93c0,
}

export default RedirectController
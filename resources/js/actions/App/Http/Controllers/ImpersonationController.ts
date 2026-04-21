import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpersonationController::start
* @see app/Http/Controllers/ImpersonationController.php:16
* @route '/impersonate/{user}'
*/
export const start = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/impersonate/{user}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImpersonationController::start
* @see app/Http/Controllers/ImpersonationController.php:16
* @route '/impersonate/{user}'
*/
start.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return start.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpersonationController::start
* @see app/Http/Controllers/ImpersonationController.php:16
* @route '/impersonate/{user}'
*/
start.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImpersonationController::start
* @see app/Http/Controllers/ImpersonationController.php:16
* @route '/impersonate/{user}'
*/
const startForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImpersonationController::start
* @see app/Http/Controllers/ImpersonationController.php:16
* @route '/impersonate/{user}'
*/
startForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\ImpersonationController::stop
* @see app/Http/Controllers/ImpersonationController.php:50
* @route '/impersonate-stop'
*/
export const stop = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/impersonate-stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImpersonationController::stop
* @see app/Http/Controllers/ImpersonationController.php:50
* @route '/impersonate-stop'
*/
stop.url = (options?: RouteQueryOptions) => {
    return stop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpersonationController::stop
* @see app/Http/Controllers/ImpersonationController.php:50
* @route '/impersonate-stop'
*/
stop.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImpersonationController::stop
* @see app/Http/Controllers/ImpersonationController.php:50
* @route '/impersonate-stop'
*/
const stopForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImpersonationController::stop
* @see app/Http/Controllers/ImpersonationController.php:50
* @route '/impersonate-stop'
*/
stopForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(options),
    method: 'post',
})

stop.form = stopForm

const ImpersonationController = { start, stop }

export default ImpersonationController
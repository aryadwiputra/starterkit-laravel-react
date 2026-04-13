import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::index
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:23
* @route '/settings/features'
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

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/settings/features/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::users
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:114
* @route '/settings/features/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::store
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:55
* @route '/settings/features'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/features',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::store
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:55
* @route '/settings/features'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::store
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:55
* @route '/settings/features'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::store
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:55
* @route '/settings/features'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::store
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:55
* @route '/settings/features'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::update
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:77
* @route '/settings/features/{featureFlag}'
*/
export const update = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/features/{featureFlag}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::update
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:77
* @route '/settings/features/{featureFlag}'
*/
update.url = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { featureFlag: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { featureFlag: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            featureFlag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        featureFlag: typeof args.featureFlag === 'object'
        ? args.featureFlag.id
        : args.featureFlag,
    }

    return update.definition.url
            .replace('{featureFlag}', parsedArgs.featureFlag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::update
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:77
* @route '/settings/features/{featureFlag}'
*/
update.put = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::update
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:77
* @route '/settings/features/{featureFlag}'
*/
const updateForm = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::update
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:77
* @route '/settings/features/{featureFlag}'
*/
updateForm.put = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::destroy
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:99
* @route '/settings/features/{featureFlag}'
*/
export const destroy = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/features/{featureFlag}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::destroy
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:99
* @route '/settings/features/{featureFlag}'
*/
destroy.url = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { featureFlag: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { featureFlag: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            featureFlag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        featureFlag: typeof args.featureFlag === 'object'
        ? args.featureFlag.id
        : args.featureFlag,
    }

    return destroy.definition.url
            .replace('{featureFlag}', parsedArgs.featureFlag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::destroy
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:99
* @route '/settings/features/{featureFlag}'
*/
destroy.delete = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::destroy
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:99
* @route '/settings/features/{featureFlag}'
*/
const destroyForm = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\FeatureFlagsController::destroy
* @see app/Http/Controllers/Settings/FeatureFlagsController.php:99
* @route '/settings/features/{featureFlag}'
*/
destroyForm.delete = (args: { featureFlag: number | { id: number } } | [featureFlag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const FeatureFlagsController = { index, users, store, update, destroy }

export default FeatureFlagsController
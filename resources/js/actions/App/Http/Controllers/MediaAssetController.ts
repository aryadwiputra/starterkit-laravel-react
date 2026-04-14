import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:34
* @route '/media'
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
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:56
* @route '/media'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:56
* @route '/media'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:56
* @route '/media'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:56
* @route '/media'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:56
* @route '/media'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:74
* @route '/media/{mediaAsset}'
*/
export const destroy = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/media/{mediaAsset}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:74
* @route '/media/{mediaAsset}'
*/
destroy.url = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mediaAsset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { mediaAsset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            mediaAsset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mediaAsset: typeof args.mediaAsset === 'object'
        ? args.mediaAsset.id
        : args.mediaAsset,
    }

    return destroy.definition.url
            .replace('{mediaAsset}', parsedArgs.mediaAsset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:74
* @route '/media/{mediaAsset}'
*/
destroy.delete = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:74
* @route '/media/{mediaAsset}'
*/
const destroyForm = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:74
* @route '/media/{mediaAsset}'
*/
destroyForm.delete = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
export const download = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/media/{mediaAsset}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
download.url = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mediaAsset: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { mediaAsset: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            mediaAsset: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mediaAsset: typeof args.mediaAsset === 'object'
        ? args.mediaAsset.id
        : args.mediaAsset,
    }

    return download.definition.url
            .replace('{mediaAsset}', parsedArgs.mediaAsset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
download.get = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
download.head = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
const downloadForm = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
downloadForm.get = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::download
* @see app/Http/Controllers/MediaAssetController.php:85
* @route '/media/{mediaAsset}/download'
*/
downloadForm.head = (args: { mediaAsset: string | number | { id: string | number } } | [mediaAsset: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const MediaAssetController = { index, store, destroy, download }

export default MediaAssetController
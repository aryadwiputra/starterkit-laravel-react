import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
export const document = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: document.url(options),
    method: 'get',
})

document.definition = {
    methods: ["get","head"],
    url: '/api/docs.json',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
document.url = (options?: RouteQueryOptions) => {
    return document.definition.url + queryParams(options)
}

/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
document.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: document.url(options),
    method: 'get',
})

/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
document.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: document.url(options),
    method: 'head',
})

/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
const documentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: document.url(options),
    method: 'get',
})

/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
documentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: document.url(options),
    method: 'get',
})

/**
* @see routes/web.php:18
* @route '/api/docs.json'
*/
documentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: document.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

document.form = documentForm

const docs = {
    document: Object.assign(document, document),
}

export default docs
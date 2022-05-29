import pluralize from 'pluralize'
import { clipByLastIndex, clipByRegexps, lowerCaseFirst } from './util'

interface Location {
    /** Full path to file from TS */
    fileName: string
    /** Offset */
    position: number
}

export interface ExperimentalExternalGlobalApiEntry {
    handler(
        fullExpression: string,
        lastPartExpression: string | undefined,
        additionalParams: {
            callExpression?: string
            location?: Location
        },
    ): string | void
}

export interface GetVariableNameFromCallExpresionOptions {
    /** Overwrite current regex */
    validRegex?: RegExp
    additionalRegex?: RegExp
    allowApi?: boolean
    location?: Location
}

export interface GetSingularFormFromExpressionOptions {
    cleanRegexps?: RegExp[]
}

const DEFAULT_CLIP_CHARS = [' ', '.']

export const getVariableNameFromCallExpresion = (
    expression: string,
    {
        // need to think of exposing regex builder api e.g. allow to specify prefix (get) and clip (by) keywords independently
        validRegex = /^(get|read|create|retrieve|select|modify|update|use|find)(?<LOWER_FIRST_NAME>[A-Z].+?)(By.*)?$/,
        // additionalRegex,
        allowApi = false,
        location,
    }: GetVariableNameFromCallExpresionOptions = {},
) => {
    const callExpression = /(.+?)\(/.exec(expression)?.[1]
    const lastExpressionPart = callExpression && clipByLastIndex(callExpression, DEFAULT_CLIP_CHARS)
    if (allowApi) {
        const handlers: ExperimentalExternalGlobalApiEntry[] = globalThis.__API_CONST_NAME_VAR_CALL ?? []
        for (const handler of handlers) {
            const result = handler.handler(expression, lastExpressionPart, {
                callExpression,
                location,
            })
            if (result) return result
        }
    }

    if (!callExpression || !lastExpressionPart) return
    const matchGroups = validRegex.exec(lastExpressionPart)?.groups
    const lowerFirstVarName = matchGroups?.LOWER_FIRST_NAME
    if (!lowerFirstVarName) return
    return lowerCaseFirst(lowerFirstVarName)
}

export const getSingularFormFromExpression = (expression: string, { cleanRegexps = [/all(.+)/, /(.+)List$/] }: GetSingularFormFromExpressionOptions = {}) => {
    const lastExpressionPart = clipByLastIndex(expression, DEFAULT_CLIP_CHARS)
    const clean = clipByRegexps(lastExpressionPart, cleanRegexps)
    const singular = pluralize(clean, 1)
    // If nothing is changed then most probably we failed to get singular form
    if (clean === singular) return
    // Always lowercase, probably not the best solution
    return lowerCaseFirst(singular)
}

export const clipByLastIndex = (input: string, chars: string[]) => {
    for (const char of chars) {
        const index = input.lastIndexOf(char)
        input = /* clip exclusively */ input.slice(index === -1 ? 0 : index + 1)
    }

    return input
}

/**
 * @param regexps Must have a least one capture group
 */
export const clipByRegexps = (input: string, regexps: RegExp[]) => {
    for (const regexp of regexps) input = input.match(regexp)?.[1] ?? input
    return input
}

export const lowerCaseFirst = (input: string) => input[0]!.toLowerCase() + input.slice(1)

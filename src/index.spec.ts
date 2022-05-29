/* eslint-disable @typescript-eslint/naming-convention */
import type {} from 'vitest/globals'
import { getSingularFormFromExpression, getVariableNameFromCallExpresion } from './index'

type TestCases = Record<string, (e: Vi.Assertion) => void>

test('getVariableNameFromCallExpresion()', () => {
    const cases: TestCases = {
        'getVariableNameFromCallExpresion(...args)': e => e.toBe('variableNameFromCallExpresion'),
        // That's weird but I don't see anything actionable here
        'getID()': e => e.toBe('iD'),
        'useRouter()': e => e.toBe('router'),
        'fs.readFile()': e => e.toBe('file'),
        'this.getIsScrolledToTop()': e => e.toBe('isScrolledToTop'),
        '[...test].findIndex()': e => e.toBe('index'),
        'await modifyJsonFile(() => {getUser()}, {getSomeFlag: false})': e => e.toBe('jsonFile'),
        'document.getElementsByTagNameNS(namespaceURI, localName)': e => e.toBe('elements'),
        'fs.select()': e => e.toBe(undefined),
        // allow?
        // 'require("fs").readFile()': e => e.toBe(undefined)
        // 'await user.get(...anyArgs)': e => e.toBe('user'),
        // 'await testUpdateRect(...anyArgs)': e => e.toBe('rect'),
        // shouldn't be iterator here
        'selectedThing.getHandler().getIterator()': e => e.toBe('handler'),
        'await updateRect(...anyArgs)': e => e.toBe('rect'),
        'await selectedUser(...anyArgs)': e => e.toBe(undefined),
        'this.messages.find((message) => message.getId() === messageId)': e => e.toBe(undefined),
        'this.messages.findUser((message) => message.getId() === messageId)': e => e.toBe('user'),
        'await this.messages.find.this.messages.find.this.messages.findUser()': e => e.toBe('user'),
    }
    for (const [testCase, func] of Object.entries(cases)) func(expect(getVariableNameFromCallExpresion(testCase)))
})

test('getSingularFormFromExpression()', () => {
    const cases: TestCases = {
        items: e => e.toMatchInlineSnapshot('"item"'),
        $refs: e => e.toMatchInlineSnapshot('"$ref"'),
        //
        'items.array': e => e.toMatchInlineSnapshot('undefined'),
        'user.getItems()': e => e.toMatchInlineSnapshot('undefined'),
        //
        MessagesList: e => e.toMatchInlineSnapshot('"message"'),
        allMessagesList: e => e.toMatchInlineSnapshot('"message"'),
        messageList: e => e.toMatchInlineSnapshot('undefined'),
        messagesList: e => e.toMatchInlineSnapshot('"message"'),
        'await this.messages.find.this.messages.findUser().superMessages': e => e.toBe('superMessage'),
    }

    for (const [testCase, func] of Object.entries(cases)) func(expect(getSingularFormFromExpression(testCase)))
})

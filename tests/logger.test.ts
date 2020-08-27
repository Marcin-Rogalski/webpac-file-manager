import { ParseMessage, colorCodeMatcher, colorTagMatcher } from '../src/services/logger'

let testMessage: string
let colorCode

describe('Color matching', () => {

    test('match magenta', () => {
        testMessage = 'test message#m# test'
        colorCode = colorCodeMatcher.exec(testMessage)[1]
        expect(colorCode).toBe('m')
    })

    test('match cyan', () => {
        testMessage = 'test message#c# test'
        colorCode = colorCodeMatcher.exec(testMessage)[1]
        expect(colorCode).toBe('c')
    })

    test('match rainbow', () => {
        testMessage = 'test message#rb# test'
        colorCode = colorCodeMatcher.exec(testMessage)[1]
        expect(colorCode).toBe('rb')
    })

    test('match random', () => {
        testMessage = 'test message#rd# test'
        colorCode = colorCodeMatcher.exec(testMessage)[1]
        expect(colorCode).toBe('rd')
    })

})

describe('Message parsing', () => {

    test('expect output', () => {
        testMessage = 'Test $$message#y# $$colorfull content#rb# test.'
        testMessage = ParseMessage(testMessage)

        console.log(testMessage)

        expect(testMessage).not.toBe(undefined)
    })


})
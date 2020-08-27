import 'colors'
import { Options } from '../file-manager-plugin'

type LogType = 'MESSAGE' | 'WARNING' | 'ERROR'

export type Logger = (logType: LogType, message: string) => void

export const colorCodeMatcher = /\#(.|rb|rd)\#/
export const colorTagMatcher = /\#(?:.|rb|rd)\#/

export function ParseMessage(message: string, colorize: boolean = true): string {

    return message
        .split('$$')
        .map(messagePart => {

            let parts = messagePart.split(colorTagMatcher)
            let color = parts[0]
            let plain = parts[1] !== undefined ? parts[1] : ''

            if (colorize && colorTagMatcher.test(messagePart)) {

                let colorCode: string = colorCodeMatcher.exec(messagePart)[1]

                switch (colorCode.toLowerCase()) {
                    case 'c': { color = color.cyan; break }
                    case 'g': { color = color.green; break }
                    case 'y': { color = color.yellow; break }
                    case 'r': { color = color.red; break }
                    case 'm': { color = color.magenta; break }
                    case 'rb': { color = color.rainbow; break }
                    case 'rd': { color = color.random; break }
                }

            }

            return color + plain
        })
        .join('')
}

/**
 * Simple logger that uses patterns to colorize output.
 * Example: 'Test - $$some text$c$' will be printed 'Test - <cyan>some text</cyan>'
 * 
 * @param options - these are file-manager-plugin's options
 */
export default function CreateLogger(options: Options): Logger {

    const { colors, verbose, silent, throwError } = options

    return function Log(logType, message) {
        if (logType !== 'ERROR' && silent) return
        if (!verbose && logType === 'MESSAGE') return

        if (logType === 'WARNING') {
            message = `$$WARNING#y# ${message}`
        }

        if (logType === 'ERROR') {
            message = `$$ERROR#r# ${message}`
        }
        message = ParseMessage(message)
        console.log(message)
    }

}
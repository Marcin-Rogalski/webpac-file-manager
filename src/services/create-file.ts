import { existsSync, lstatSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { CreateFileOptions } from '../interfaces/create-options'
import deleteFile from './delete-file'

export default function createFile(target: string, content: string, options: CreateFileOptions): void {
    target = resolve(target)

    const { increment, overwrite } = options

    if (existsSync(target)) {
        if (lstatSync(target).isDirectory()) throw new Error(`Cannot write content into a directory!\n\t${target}`)
        if (!overwrite) throw new Error(`File already exists!\n\t${target}`)
        if (!increment) deleteFile(target, options)
    }

    const flag = increment ? 'a' : 'w'

    writeFileSync(target, content, { flag })
}
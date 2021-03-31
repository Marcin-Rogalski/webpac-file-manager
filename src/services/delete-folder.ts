/// <reference path="./delete-file.ts" />

import { existsSync, rmdirSync, readdirSync, lstatSync } from 'fs'
import { join, resolve } from 'path'
import { DeleteFolderOptions } from '../interfaces/delete-options'
import deleteFile from './delete-file'

export default function deleteFolder(target: string, regex: RegExp, options: DeleteFolderOptions): void {
    target = resolve(target)

    if (!existsSync(target)) return
    if (regex) {
        const content = readdirSync(target)
        content.forEach(fileOrFolder => {
            const path = join(target, fileOrFolder)
            lstatSync(path).isDirectory()
                ? deleteFolder(path, regex, options)
                : regex.test(fileOrFolder) && deleteFile(path, options)
        })
    }

    else rmdirSync(target, { recursive: true })
}
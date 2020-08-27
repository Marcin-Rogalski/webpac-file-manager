import { existsSync, readdirSync, lstatSync } from 'fs'
import { join, resolve } from 'path'
import { CopyOrMoveFolderOptions } from '../interfaces/copy-options'
import copyFile from './copy-file'
import createFolder from './create-folder'

export default function copyFolder(source: string, target: string, regex: RegExp, options: CopyOrMoveFolderOptions): void {

    source = resolve(source)
    target = resolve(target)

    if (lstatSync(source).isFile()) throw new Error(`$$(COPY)#g# $$Source is not a folder!#r#\n\t$$${source}#c#`)

    const targetExists = existsSync(target)

    if (!targetExists && !options.createDir) throw new Error(`$$(COPY)#g# $$Target desn't exist!#r#\n\t$$${target}#c#`)
    if (!targetExists && !regex) createFolder(target, options)

    const content = readdirSync(source)

    content
        .forEach(fileOrFolder => {
            const sourcePath = join(source, fileOrFolder)
            const targetPath = join(target, fileOrFolder)

            if (lstatSync(sourcePath).isDirectory()) return copyFolder(sourcePath, targetPath, regex, options)
            if (!regex || regex.test(fileOrFolder)) {
                targetExists || createFolder(target, options)
                copyFile(sourcePath, targetPath, options)
            }
        })
}
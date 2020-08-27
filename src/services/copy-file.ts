import { existsSync, mkdirSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve, basename } from 'path'
import { CopyOrMoveFileOptions } from '../interfaces/copy-options'

export default function copyFile(source: string, target: string, options: CopyOrMoveFileOptions): void {
    source = resolve(source)
    target = resolve(target)

    if (!existsSync(source)) throw new Error(`Source does not exist - ${source}`)

    // SOURCE
    const name = basename(source)
    const content = readFileSync(source)
    const flag = options.increment ? 'a' : 'w'

    // TARGET
    const type: 'file' | 'folder' = existsSync(target)
        ? lstatSync(target).isFile() ? 'file' : 'folder'
        : target.split('/').pop().split('\\').pop().includes('.') ? 'file' : 'folder'

    if (type === 'folder') {
        if (!(existsSync(target) || (options.createDir && mkdirSync(target, { recursive: true })))) throw new Error(`Target does not exist - ${target}`)
        target = join(target, name)
    }

    if (existsSync(target) && !options.overwrite) throw new Error(`Target already exists - ${target}`)

    // ACTION
    writeFileSync(target, content, { flag })
}
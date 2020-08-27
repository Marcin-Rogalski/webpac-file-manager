import { existsSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { DeleteFileOptions } from '../interfaces/delete-options'

export default function deleteFile(target: string, options: DeleteFileOptions): void {
    target = resolve(target)
    if (existsSync(target)) unlinkSync(target)
}
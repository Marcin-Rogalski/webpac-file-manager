import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { CreateFolderOptions } from '../interfaces/create-options'

export default function createFolder(target: string, options: CreateFolderOptions): void {
    target = resolve(target)
    existsSync(target) || mkdirSync(target,{recursive:true})
}
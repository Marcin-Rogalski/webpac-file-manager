import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { CreateFileOptions } from '../interfaces/create-options'

export default function createFile(target: string, content: string, options: CreateFileOptions): void {
    target = resolve(target)
}
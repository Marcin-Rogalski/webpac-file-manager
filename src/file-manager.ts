/// <reference path="./services/create-file.ts" />
/// <reference path="./services/create-folder.ts" />
/// <reference path="./services/copy-file.ts" />
/// <reference path="./services/copy-folder.ts" />
/// <reference path="./services/delete-file.ts" />
/// <reference path="./services/delete-folder.ts" />
/// <reference path="./services/logger.ts" />

import { lstatSync, existsSync } from 'fs'
import { isRegExp, isString } from 'util'

import CreateFile from './services/create-file'
import CreateFolder from './services/create-folder'
import CreateOptions from './interfaces/create-options'

import CopyFile from './services/copy-file'
import CopyFolder from './services/copy-folder'
import CopyOrMoveOptions from './interfaces/copy-options'

import DeleteFile from './services/delete-file'
import DeleteFolder from './services/delete-folder'
import DeleteOptions from './interfaces/delete-options'

import { Logger } from './services/logger'

export default class FileManager {

    logger: Logger

    create(target: string): this
    create(target: string, content: string): this
    create(target: string, options: CreateOptions): this
    create(target: string, content: string, options: CreateOptions): this
    create(target: string, contentOrOptions?: string | CreateOptions, options?: CreateOptions): this {
        let content: string

        if (contentOrOptions !== undefined) {
            if (typeof contentOrOptions === 'string') content = contentOrOptions
            else options = contentOrOptions
        }

        content !== undefined ? CreateFile(target, content, options) : CreateFolder(target, options)
        return this
    }

    copy(source: string, target: string): this
    copy(source: string, target: string, regex: RegExp): this
    copy(source: string, target: string, options: CopyOrMoveOptions): this
    copy(source: string, target: string, regex: RegExp, options: CopyOrMoveOptions): this
    copy(source: string, target: string, regexOrOptions?: RegExp | CopyOrMoveOptions, options?: CopyOrMoveOptions): this {
        if (!existsSync(source)) throw new Error(`$$(COPY)#g# $$Source doesn't exist!#r#\n\t$$${source}#c#`)

        let regex

        if (regexOrOptions !== undefined) {
            if (isRegExp(regexOrOptions)) regex = regexOrOptions
            else options = regexOrOptions
        }


        lstatSync(source).isFile() ? CopyFile(source, target, options) : CopyFolder(source, target, regex, options)
        return this
    }

    move(source: string, target: string): this
    move(source: string, target: string, regex: RegExp): this
    move(source: string, target: string, options: CopyOrMoveOptions): this
    move(source: string, target: string, regex: RegExp, options: CopyOrMoveOptions): this
    move(source: string, target: string, regexOrOptions?: RegExp | CopyOrMoveOptions, options?: CopyOrMoveOptions): this {
        if (!existsSync(source)) throw new Error(`$$(MOVE)#g# $$Source doesn't exist!#r#\n\t$$${source}#c#`)

        let regex

        if (regexOrOptions !== undefined) {
            if (isRegExp(regexOrOptions)) regex = regexOrOptions
            else options = regexOrOptions
        }

        this.copy(source, target, regex, options)
        this.delete(source, regex, options)
        return this
    }

    delete(target: string): this
    delete(target: string, regex: RegExp): this
    delete(target: string, options: DeleteOptions): this
    delete(target: string, regex: RegExp, options: DeleteOptions): this
    delete(target: string, regexOrOptions?: RegExp | DeleteOptions, options?: DeleteOptions): this {
        if (!existsSync(target)) {
            this.logger('WARNING', `$$(DELETE)#g# $$Target doesn't exist!#y#\n\t$$${target}#c#`)
            return this
        }

        let regex

        if (regexOrOptions !== undefined) {
            if (isRegExp(regexOrOptions)) regex = regexOrOptions
            else options = regexOrOptions
        }

        lstatSync(target).isFile() ? DeleteFile(target, options) : DeleteFolder(target, regex, options)
        return this
    }

}
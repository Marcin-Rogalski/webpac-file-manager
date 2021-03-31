/// <reference path="./file-manager.ts" />
/// <reference path="./services/logger.ts" />

import _FileManager from './file-manager'
import ExecuteOptions from './interfaces/execute-options'
import CreateOptions from './interfaces/create-options'
import CopyOrMoveOptions from './interfaces/copy-options'
import DeleteOptions from './interfaces/delete-options'
import CreateLogger from './services/logger'

export const FileManager = _FileManager

/**
 * This interface represenst options specific to plugin's internal mechanics.
 */
export interface Options extends ExecuteOptions, CreateOptions, CopyOrMoveOptions, DeleteOptions {
    verbose: boolean
    silent: boolean
    colors: boolean
    throwError: boolean
}

/**
 * Below interfaces are different sets of inpunt ( required and optinal ) needed to perform acitons like Copy.
 */
export interface CreateFileAction {
    target: string
    content: string,
    options?: Partial<CreateOptions>
}

export interface CreateFolderAction {
    target: string
    options?: Partial<CreateOptions>
}

export interface CopyOrMoveFileAction {
    source: string
    target: string
    options?: Partial<CopyOrMoveOptions>
}

export interface CopyOrMoveFolderAction {
    source: string
    target: string
    regex?: RegExp
    options?: Partial<CopyOrMoveOptions>
}

export interface DeleteFileAction {
    target: string
    options?: Partial<DeleteOptions>
}

export interface DeleteFolderAction {
    target: string
    regex?: RegExp
    options?: Partial<DeleteOptions>
}

/**
 * This is a Type that is basicaly a description of an Action and its required input.
 */
export type ActionType = 'CREATE' | 'COPY' | 'MOVE' | 'DELETE'
export type Action =
    { type: 'CREATE' } & CreateFileAction |
    { type: 'CREATE' } & CreateFolderAction |
    { type: 'COPY' | 'MOVE' } & CopyOrMoveFileAction |
    { type: 'COPY' | 'MOVE' } & CopyOrMoveFolderAction |
    { type: 'DELETE' } & DeleteFileAction |
    { type: 'DELETE' } & DeleteFolderAction


/**
 * This class is a FileManager's extension that's main purpose is to tap to Webpack's compilers hooks.
 * It also overwrites FileManager's default behaviours - instead of maipulating files it now creates 
 * Action objects that describe those manipulations. Those actions are then used when compilers hooks
 * are triggered to feed FileManager's original functions with data.
 */
export class FileManagerPlugin extends FileManager {
    private options: Options
    private actions: Array<Action>

    constructor(options?: Partial<Options>) {
        super()

        /**
         * createDir - allows for non-existing directories while moving/copying files or folders
         * overwrite - allowf for overwriting existing files while creating/moving/copying files,
         * it also allows for copying/moving into existing directories
         * increment - each time a file is created/moved/copied to an existing file, data wil be
         * incremented, not overwriten
         * execute - defines whether to performa actions BEFORE or AFTER compiler's work
         * verbose - show more info while working
         * silent - blocks every message logged by plugin
         * colors - allow coloring console logs
         */
        this.options = {
            createDir: options?.createDir ?? true,
            overwrite: options?.overwrite ?? true,
            increment: options?.increment ?? false,
            execute: options?.execute ?? 'BEFORE',
            verbose: options?.verbose ?? false,
            silent: options?.silent ?? false,
            colors: options?.colors ?? true,
            throwError: options?.throwError ?? false,
        }

        this.logger = CreateLogger(this.options)

        this.actions = []
    }

    /**
     * Here plugin taps into compiler's hooks.
     * 
     * @param compiler - Webpack compiler
     */
    apply(compiler: any): void {

        /**
         * This is a function that will be invoked on compiler's hook.
         * 
         * @param actions - actions that will be performed on this hook.
         */
        const operate = (actions: Array<Action>): void => {

            actions.forEach(action => {
                const type = action.type
                const options = Object.assign({}, this.options, action.options || {})   // here plugin's options are overwritten by custom action's options

                switch (type) {

                    case 'CREATE': {
                        const { target, content } = action as CreateFileAction
                        this.logger('MESSAGE', `$$CREATE#g# $$${target}#c#`)
                        super.create(target, content, options)
                        break
                    }

                    case "COPY": {
                        const { source, target, regex } = action as CopyOrMoveFolderAction
                        this.logger('MESSAGE', `$$COPY#g# $$${source}#c# to $$${target}#c#`)
                        super.copy(source, target, regex, options)
                        break
                    }

                    case 'MOVE': {
                        const { source, target, regex } = action as CopyOrMoveFolderAction
                        this.logger('MESSAGE', `$$MOVE#g# $$${source}#c# to $$${target}#c#`)
                        super.move(source, target, regex, options)
                        break
                    }

                    case "DELETE": {
                        const { target, regex } = action as DeleteFolderAction
                        this.logger('MESSAGE', `$$DELETE#g# $$${target}#c#`)
                        super.delete(target, regex, options)
                        break
                    }

                    default: { throw new Error(`$$Type#r# $$${type}#g# $$is not supported!#r#`) }

                }

            })
        }
        const tap = (actions: Array<Action>) => {
            return (compilerOrCompilation, callback): void => {
                try { operate(actions); callback() }
                catch (error) {
                    this.logger('ERROR', (error as Error).message)
                    this.options.throwError || callback()
                }
            }
        }

        const actionsBefore: Array<Action> = []
        const actionsAfter: Array<Action> = []

        this.actions.forEach((action: Action) => {
            let execute = (action.options as Partial<ExecuteOptions>)?.execute !== undefined
                ? (action.options as Partial<ExecuteOptions>)?.execute
                : this.options.execute

            execute === 'BEFORE'
                ? actionsBefore.push(action)
                : actionsAfter.push(action)
        })

        actionsBefore.length === 0 || compiler.hooks.beforeRun.tapAsync('CopyBefore', tap(actionsBefore))
        actionsAfter.length === 0 || compiler.hooks.afterEmit.tapAsync('CopyAfter', tap(actionsAfter))
    }

    create(target: string): this
    create(target: string, options: Partial<CreateOptions>): this
    create(target: string, content: string): this
    create(target: string, content: string, options: Partial<CreateOptions>): this
    create(target: string, contentOrOptions?: string | Partial<CreateOptions>, options?: Partial<CreateOptions>): this {
        // @ts-ignore
        this.actions.push({ type: 'CREATE', target, content: contentOrOptions, options })
        return this
    }

    move(source: string, target: string): this
    move(source: string, target: string, options: Partial<CopyOrMoveOptions>): this
    move(source: string, target: string, regex: RegExp): this
    move(source: string, target: string, regex: RegExp, options: Partial<CopyOrMoveOptions>): this
    move(source: string, target: string, regexOrOptions?: RegExp | Partial<CopyOrMoveOptions>, options?: Partial<CopyOrMoveOptions>): this {
        // @ts-ignore
        this.actions.push({ type: 'MOVE', source, target, regex: regexOrOptions, options })
        return this
    }

    copy(source: string, target: string): this
    copy(source: string, target: string, options: Partial<CopyOrMoveOptions>): this
    copy(source: string, target: string, regex: RegExp): this
    copy(source: string, target: string, regex: RegExp, options: Partial<CopyOrMoveOptions>): this
    copy(source: string, target: string, regexOrOptions?: RegExp | Partial<CopyOrMoveOptions>, options?: Partial<CopyOrMoveOptions>): this {
        // @ts-ignore
        this.actions.push({ type: 'COPY', source, target, regex: regexOrOptions, options })
        return this
    }

    delete(target: string): this
    delete(target: string, regex: RegExp): this
    delete(target: string, options: Partial<DeleteOptions>): this
    delete(target: string, regex: RegExp, options: Partial<DeleteOptions>): this
    delete(target: string, regexOrOptions?: RegExp | Partial<DeleteOptions>, options?: Partial<DeleteOptions>): this {
        // @ts-ignore
        this.actions.push({ type: 'DELETE', target, regex: regexOrOptions, options })
        return this
    }
}

export default FileManagerPlugin
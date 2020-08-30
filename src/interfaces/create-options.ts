import ExecuteOptions from './execute-options'

export interface CreateFileOptions {
    increment: boolean
    overwrite: boolean
}

export interface CreateFolderOptions {
    increment: boolean
    overwrite: boolean
}

export default interface CreateOptions extends ExecuteOptions, CreateFileOptions, CreateFolderOptions { }
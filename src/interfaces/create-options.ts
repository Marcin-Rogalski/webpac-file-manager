import ExecuteOptions from './execute-options'

export interface CreateFileOptions {
    increment: boolean
}

export interface CreateFolderOptions {
    increment: boolean
}

export default interface CreateOptions extends ExecuteOptions, CreateFileOptions, CreateFolderOptions { }
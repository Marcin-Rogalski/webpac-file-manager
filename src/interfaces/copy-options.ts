import CreateOptions from './create-options'
import ExecuteOptions from './execute-options'

export interface CopyOrMoveFileOptions extends CreateOptions {
    overwrite: boolean
    createDir: boolean
}

export interface CopyOrMoveFolderOptions extends CreateOptions {
    overwrite: boolean
    createDir: boolean
}

export default interface CopyOrMoveOptions extends ExecuteOptions, CreateOptions, CopyOrMoveFileOptions, CopyOrMoveFolderOptions { }
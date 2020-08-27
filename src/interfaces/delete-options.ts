import ExecuteOptions from './execute-options'

export interface DeleteFileOptions {

}

export interface DeleteFolderOptions {
    
}

export default interface DeleteOptions extends ExecuteOptions, DeleteFileOptions, DeleteFolderOptions { }
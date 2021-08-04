import { NotebookModel } from "../NotebookTypes";

export const NOTEBOOK_CREATE_ACTION_TYPE = 'notebooks/create';
export const NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE = 'notebooks/create:success';
export const NOTEBOOK_CREATE_FAILURE_ACTION_TYPE = 'notebooks/create:failure';

/**
 * Represents a create notebook action payload
 */
export interface CreateNotebookAction {
    type: typeof NOTEBOOK_CREATE_ACTION_TYPE,
    payload: {
        id?: string,
        name: string,
        description: string,
        hash: string
    }
}

export interface CreateNotebookSuccessAction {
    type: typeof NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
    payload: {
        data: NotebookModel,
        hash: string
    }
};

export interface CreateNotebookFailureAction {
    type: typeof NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
    payload: {
        hash: string,
        error: string
    }
}

/**
 * @param options.id optional id of notebook
 * @param options.name The name of the notebook
 * @param options.description The description of the notebook
 * @returns action
 */
export function createNotebookAction({ id, name, description } : {id?: string, name: string, description: string}) : CreateNotebookAction {
    return {
        type: NOTEBOOK_CREATE_ACTION_TYPE,
        payload: {
            id,
            name,
            description,
            // Use the hash to track status of error/create etc
            // Without the hash user cannot be notified of errors
            hash: btoa(JSON.stringify({id, name, description}))
        }
    };
};

/**
 * An action to dispatch after notebook is sucessfully created
 * @param hash THe hash of create payload
 * @param notebook Notebook payload
 * @returns action: CreateNotebookSuccessAction
 */
export function createNotebookSuccessAction(hash: string, notebook: NotebookModel) : CreateNotebookSuccessAction {
    return {
        type: NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
        payload: {
            data: notebook,
            hash
        }
    }
};

/**
 * An action to dispatch if create notebook action fails
 * @param hash The hash of the request
 * @param error The error associated with creating notebook
 * @returns 
 */
export function createNotebookFailureAction(hash: string, error: string) : CreateNotebookFailureAction {
    return {
        type: NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
        payload: {
            hash,
            error
        }
    };
};

// Export all possible notebook actions here
export type NotebookActions = CreateNotebookAction | CreateNotebookSuccessAction | CreateNotebookFailureAction;
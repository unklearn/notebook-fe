import { ContainerConfiguration, NotebookModel } from "../NotebookTypes";

export const NOTEBOOK_CREATE_ACTION_TYPE = "notebooks/create";
export const NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE = "notebooks/create:success";
export const NOTEBOOK_CREATE_FAILURE_ACTION_TYPE = "notebooks/create:failure";
export const NOTEBOOK_GET_BY_ID_ACTION_TYPE = "notebooks/get-by-id";
export const NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE =
  "notebooks/get-by-id:success";
export const NOTEBOOK_GET_BY_ID_FAILURE_ACTION_TYPE =
  "notebooks/get-by-id:failure";
export const NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE =
  "notebooks/container-create";
export const NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE =
  "notebooks/container-status";
export const NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE =
  "notebooks/execute-command";

/**
 * Represents a create notebook action payload
 */
export interface CreateNotebookAction {
  type: typeof NOTEBOOK_CREATE_ACTION_TYPE;
  payload: Partial<NotebookModel> & {
    hash: string;
  };
}

export interface CreateNotebookSuccessAction {
  type: typeof NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE;
  payload: {
    data: NotebookModel;
    hash: string;
  };
}

export interface CreateNotebookFailureAction {
  type: typeof NOTEBOOK_CREATE_FAILURE_ACTION_TYPE;
  payload: {
    hash: string;
    error: string;
  };
}

export interface UpdateNotebookContainerStatusAction {
  type: typeof NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE;
  payload: {
    notebookId: string;
    containerId: string;
    hash?: string;
    status: ContainerConfiguration["status"];
  };
}

export interface GetNotebookByIdAction {
  type: typeof NOTEBOOK_GET_BY_ID_ACTION_TYPE;
  payload: {
    notebookId: string;
  };
}

export interface GetNotebookByIdSuccessAction {
  type: typeof NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE;
  payload: {
    notebook: NotebookModel;
  };
}

export interface GetNotebookByIdFailureAction {
  type: typeof NOTEBOOK_GET_BY_ID_FAILURE_ACTION_TYPE;
  payload: {
    notebookId: string;
    error: string;
    missing: boolean;
  };
}

export interface CreateNotebookContainerAction {
  type: typeof NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE;
  payload: {
    notebookId: string;
    configuration: ContainerConfiguration;
    hash: string;
  };
}

export interface ExecuteCommandInContainerAction {
  type: typeof NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE;
  payload: {
    notebookId: string;
    containerId: string;
    cellId: string;
    interactive?: boolean;
    useTty?: boolean;
    timeout?: number;
    command: string[];
  };
}

/**
 * @param notebookData The notebook data payload
 * @returns action
 */
export function createNotebookAction(
  notebookData: Partial<NotebookModel>
): CreateNotebookAction {
  return {
    type: NOTEBOOK_CREATE_ACTION_TYPE,
    payload: {
      ...notebookData,
      // Use the hash to track status of error/create etc
      // Without the hash user cannot be notified of errors
      hash: btoa(JSON.stringify(notebookData)),
    },
  };
}

/**
 * An action to dispatch after notebook is sucessfully created
 * @param hash THe hash of create payload
 * @param notebook Notebook payload
 * @returns action: CreateNotebookSuccessAction
 */
export function createNotebookSuccessAction(
  hash: string,
  notebook: NotebookModel
): CreateNotebookSuccessAction {
  return {
    type: NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
    payload: {
      data: notebook,
      hash,
    },
  };
}

/**
 * An action to dispatch if create notebook action fails
 * @param hash The hash of the request
 * @param error The error associated with creating notebook
 * @returns
 */
export function createNotebookFailureAction(
  hash: string,
  error: string
): CreateNotebookFailureAction {
  return {
    type: NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
    payload: {
      hash,
      error,
    },
  };
}

/**
 * Update the status of a notebook container
 * @param notebookId The id of the notebook
 * @param containerId The id of the container in the notebook
 * @param status The status of the container in the notebook
 * @returns The action to update notebook status
 */
export function updateNotebookContainerStatusAction(
  notebookId: string,
  containerId: string,
  status: ContainerConfiguration["status"]
): UpdateNotebookContainerStatusAction {
  return {
    type: NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
    payload: {
      notebookId,
      containerId,
      status,
    },
  };
}

/**
 * An action to fetch notebook by id
 * @param notebookId The id of the notebook to fetch
 * @returns The action for fetching notebook by id
 */
export function getNotebookByIdAction(
  notebookId: string
): GetNotebookByIdAction {
  return {
    type: NOTEBOOK_GET_BY_ID_ACTION_TYPE,
    payload: {
      notebookId,
    },
  };
}

export function getNotebookSuccessAction(
  notebook: NotebookModel
): GetNotebookByIdSuccessAction {
  return {
    type: NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE,
    payload: {
      notebook,
    },
  };
}

export function getNotebookFailureAction(
  notebookId: string,
  error: string,
  missing: boolean
): GetNotebookByIdFailureAction {
  return {
    type: NOTEBOOK_GET_BY_ID_FAILURE_ACTION_TYPE,
    payload: {
      notebookId,
      error,
      missing,
    },
  };
}

/**
 * Add a new container to a notebook. The config dictates what kind of containers are spawned.
 * @param notebookId The id of the notebook
 * @param config The container configuration object
 */
export function createNotebookContainerAction(
  notebookId: string,
  config: ContainerConfiguration
): CreateNotebookContainerAction {
  return {
    type: NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
    payload: {
      notebookId,
      configuration: config,
      hash: btoa(
        JSON.stringify({
          notebookId,
          config,
        })
      ),
    },
  };
}

/**
 * Execute a command in container
 * @param notebookId The id of the notebook
 * @param containerId The id of the container
 * @param cellId Id of the cell that holds the command output cell
 * @param command The command to run
 * @param object Optional options for command.
 */
export function executeCommandInContainerAction(
  notebookId: string,
  containerId: string,
  cellId: string,
  command: string[],
  { interactive = false, useTty = false, timeout = -1 } = {}
): ExecuteCommandInContainerAction {
  return {
    type: NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE,
    payload: {
      notebookId,
      containerId,
      cellId,
      interactive,
      timeout,
      useTty,
      command,
    },
  };
}

// Export all possible notebook actions here
export type NotebookActions =
  | CreateNotebookAction
  | CreateNotebookSuccessAction
  | CreateNotebookFailureAction
  | CreateNotebookContainerAction
  | UpdateNotebookContainerStatusAction
  | GetNotebookByIdAction
  | GetNotebookByIdFailureAction
  | GetNotebookByIdSuccessAction
  | ExecuteCommandInContainerAction;

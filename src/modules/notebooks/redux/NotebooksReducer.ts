import { ModelStatus } from "../../../redux/Types";
import { nestedDeepAssign, nestedDeepGet } from "../../../utils/ObjectUtils";
import { ContainerConfiguration, NotebookModel } from "../NotebookTypes";
import {
  CreateNotebookAction,
  CreateNotebookContainerAction,
  CreateTerminalCellInNotebookAction,
  GetNotebookByIdSuccessAction,
  NotebookActions,
  NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
  NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE,
  NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE,
  UpdateNotebookContainerStatusAction,
} from "./NotebookActions";

export type NotebooksReduxState = {
  byIds: {
    [id: string]: {
      data: NotebookModel;
      status: ModelStatus;
      error?: string;
    };
  };
  filtered: {
    [viewId: string]: {
      matches: string[];
      total: number;
    };
  };
};

const INITIAL_STATE = {
  byIds: {},
  filtered: {},
};

/**
 * Create notebook reducer takes care of assigning a new notebook to state
 * @param state NotebooksReduxState the current state
 * @param action CreateNotebookAction The action corresponding to a new notebook
 * @returns state NotebooksReduxState (updated iff the action contains an id)
 */
function createNotebookReducer(
  state: NotebooksReduxState,
  action: CreateNotebookAction
): NotebooksReduxState {
  if (action.payload.id) {
    return {
      ...state,
      byIds: {
        ...state.byIds,
        [action.payload.id]: {
          data: action.payload as NotebookModel,
          status: "pending",
        },
      },
    };
  }
  return state;
}

/**
 * A reducer function that adds a notebook to internal state
 * @param state The notebook redux state
 * @param action The get success action
 */
function addNotebookReducer(
  state: NotebooksReduxState,
  action: GetNotebookByIdSuccessAction
): NotebooksReduxState {
  const notebook = action.payload.notebook;
  return {
    ...state,
    byIds: {
      ...state.byIds,
      [notebook.id]: {
        data: notebook,
        status: "done",
        error: undefined,
      },
    },
  };
}

/**
 * A reducer function that deals with creating a conditional container for a notebook.
 * Container is marked as pending
 */
function addConditionalContainerReducer(
  state: NotebooksReduxState,
  action: CreateNotebookContainerAction
): NotebooksReduxState {
  const { notebookId, configuration, hash } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "containers"];
  const containers = nestedDeepGet(state, path) || [];
  return nestedDeepAssign(
    state,
    path,
    containers.concat([
      {
        ...configuration,
        hash,
        status: "pending",
      },
    ]),
    true
  ) as NotebooksReduxState;
}

/**
 * Update the status of a container in a notebook
 */
function updateContainerStatusReducer(
  state: NotebooksReduxState,
  action: UpdateNotebookContainerStatusAction
): NotebooksReduxState {
  const { notebookId, containerId, status, hash } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "containers"];
  const containers = nestedDeepGet(state, path) || [];
  const container = containers.find((c: ContainerConfiguration) => {
    if (hash) {
      // Locate via hash. Before container gets id, we use hash for tracking
      return c.hash === hash || c.id === containerId;
    } else {
      return c.id === containerId;
    }
  });
  if (!container) {
    return state;
  }
  return nestedDeepAssign(state, ["byIds", notebookId, "data"], {
    ...notebook.data,
    containers: notebook.data.containers.map((c) => {
      if (c.id === containerId || c.hash === hash) {
        return {
          ...c,
          id: containerId,
          status,
        };
      }
      return c;
    }),
  }) as NotebooksReduxState;
}

/**
 * Add a new terminal cell to the notebook
 * @param state The redux state
 * @param action
 */
function addTerminalCellReducer(
  state: NotebooksReduxState,
  action: CreateTerminalCellInNotebookAction
) {
  const { notebookId, containerId, cellId, command } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "cells"];
  const cells = nestedDeepGet(state, path) || [];
  return nestedDeepAssign(state, ["byIds", notebookId, "data"], {
    cells: cells.concat({
      id: cellId,
      containerId,
      command,
      type: "terminal",
    }),
  }) as NotebooksReduxState;
}

export function notebooksReducer(
  state: NotebooksReduxState = INITIAL_STATE,
  action: NotebookActions
): NotebooksReduxState {
  switch (action.type) {
    case NOTEBOOK_CREATE_ACTION_TYPE:
      return createNotebookReducer(state, action);
    case NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE:
      return addNotebookReducer(state, action);
    case NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE:
      return addConditionalContainerReducer(state, action);
    case NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE:
      return updateContainerStatusReducer(state, action);
    case NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE:
      return addTerminalCellReducer(state, action);
  }
  return state;
}

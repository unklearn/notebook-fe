import { ModelStatus } from "../../../redux/Types";
import { nestedDeepAssign, nestedDeepGet } from "../../../utils/ObjectUtils";
import {
  ContainerConfiguration,
  MarkdownCell,
  NotebookCell,
  NotebookModel,
} from "../NotebookTypes";
import {
  CreateFileCellInNotebookAction,
  CreateMarkdownCellInNotebookAction,
  CreateNotebookAction,
  CreateNotebookContainerAction,
  CreateTerminalCellInNotebookAction,
  GetNotebookByIdSuccessAction,
  NotebookActions,
  NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
  NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_FILE_CELL_ACTION_TYPE,
  NOTEBOOK_CREATE_MARKDOWN_CELL_ACTION_TYPE,
  NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE,
  NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE,
  NOTEBOOK_UPDATE_FILE_CELL_ACTION_TYPE,
  NOTEBOOK_UPDATE_MARKDOWN_CELL_ACTION_TYPE,
  NOTEBOOK_UPDATE_SUCCESS_ACTION_TYPE,
  UpdateFileCellInNotebookAction,
  UpdateMarkdownCellInNotebookAction,
  UpdateNotebookContainerStatusAction,
  UpdateNotebookSuccessAction,
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
 * Update notebook success status reducer
 * @param state Notebooks state
 * @param action Update success action
 * @returns updated notebooks state
 */
function updateNotebookReducer(
  state: NotebooksReduxState,
  action: UpdateNotebookSuccessAction
): NotebooksReduxState {
  if (action.payload.id) {
    return {
      ...state,
      byIds: {
        ...state.byIds,
        [action.payload.id]: {
          data: action.payload,
          status: "done",
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

/**
 * Add a new markdown cell to the notebook
 * @param state The redux state corresponding to the notebook
 * @param action The payload corresponding to the markdown cell
 */
function addMarkdownCellReducer(
  state: NotebooksReduxState,
  action: CreateMarkdownCellInNotebookAction
): NotebooksReduxState {
  const { notebookId, content, cellId } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "cells"];
  const cells = nestedDeepGet(state, path) || [];
  return nestedDeepAssign(state, ["byIds", notebookId, "data"], {
    cells: cells.concat({
      id: cellId,
      content,
      type: "markdown",
    }),
  }) as NotebooksReduxState;
}

/**
 * Update the contents of a markdown cell
 * @param state The notebooks state
 * @param action The update action
 */
function updateMarkdownCellReducer(
  state: NotebooksReduxState,
  action: UpdateMarkdownCellInNotebookAction
): NotebooksReduxState {
  const { notebookId, content, cellId } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "cells"];
  const cells = nestedDeepGet(state, path) || [];
  return nestedDeepAssign(state, ["byIds", notebookId, "data"], {
    cells: cells.map((c: MarkdownCell) => {
      if (c.id === cellId) {
        return {
          ...c,
          content,
        };
      }
      return c;
    }),
  }) as NotebooksReduxState;
}

/**
 * Add a new file cell for a container in the notebook
 * @param state NotebooksReduxState The redux state
 * @param action The action to create file cell
 */
function addFileCellReducer(
  state: NotebooksReduxState,
  action: CreateFileCellInNotebookAction
): NotebooksReduxState {
  const { notebookId, containerId, filePath, content, cellId } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "cells"];
  const cells = nestedDeepGet(state, path) || [];
  return nestedDeepAssign(state, ["byIds", notebookId, "data"], {
    cells: cells.concat({
      id: cellId,
      content,
      filePath,
      containerId,
      type: "file",
    }),
  }) as NotebooksReduxState;
}

function updateFileCellReducer(
  state: NotebooksReduxState,
  action: UpdateFileCellInNotebookAction
): NotebooksReduxState {
  const { notebookId, filePath, content, cellId } = action.payload;
  const notebook = state.byIds[notebookId];
  if (!notebook) {
    return state;
  }
  const path = ["byIds", notebookId, "data", "cells"];
  const cells = (nestedDeepGet(state, path) || []).map((c: NotebookCell) => {
    if (c.id === cellId) {
      return {
        ...c,
        filePath,
        content,
      };
    }
    return c;
  });
  return nestedDeepAssign(state, ["byIds", notebookId, "data"], {
    cells,
  }) as NotebooksReduxState;
}

export function notebooksReducer(
  state: NotebooksReduxState = INITIAL_STATE,
  action: NotebookActions
): NotebooksReduxState {
  switch (action.type) {
    case NOTEBOOK_CREATE_ACTION_TYPE:
      return createNotebookReducer(state, action);
    case NOTEBOOK_UPDATE_SUCCESS_ACTION_TYPE:
      return updateNotebookReducer(state, action);
    case NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE:
      return addNotebookReducer(state, action);
    case NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE:
      return addConditionalContainerReducer(state, action);
    case NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE:
      return updateContainerStatusReducer(state, action);
    case NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE:
      return addTerminalCellReducer(state, action);
    case NOTEBOOK_CREATE_MARKDOWN_CELL_ACTION_TYPE:
      return addMarkdownCellReducer(state, action);
    case NOTEBOOK_UPDATE_MARKDOWN_CELL_ACTION_TYPE:
      return updateMarkdownCellReducer(state, action);
    case NOTEBOOK_CREATE_FILE_CELL_ACTION_TYPE:
      return addFileCellReducer(state, action);
    case NOTEBOOK_UPDATE_FILE_CELL_ACTION_TYPE:
      return updateFileCellReducer(state, action);
  }
  return state;
}

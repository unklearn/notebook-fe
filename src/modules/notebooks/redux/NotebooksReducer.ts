import { ModelStatus } from "../../../redux/Types";
import { nestedDeepAssign, nestedDeepGet } from "../../../utils/ObjectUtils";
import { NotebookModel } from "../NotebookTypes";
import {
  CreateNotebookAction,
  CreateNotebookContainerAction,
  GetNotebookByIdSuccessAction,
  NotebookActions,
  NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_GET_BY_ID_SUCCESS_ACTION_TYPE,
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
  const { notebookId, configuration } = action.payload;
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
        status: "pending",
      },
    ]),
    true
  ) as NotebooksReduxState;
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
  }
  return state;
}

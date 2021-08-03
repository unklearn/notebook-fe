import { ModelStatus } from "../../../redux/Types";
import { NotebookModel } from "../Types";
import { CreateNotebookAction, NotebookActions, NOTEBOOK_CREATE_ACTION_TYPE } from "./NotebookActions";

export type NotebooksReduxState = {
    byIds: {
        [id: string]: {
            data: NotebookModel,
            status: ModelStatus,
            error?: string
        }
    },
    filtered: {
        [viewId: string]: {
            matches: string[],
            total: number;
        }
    }
};

const INITIAL_STATE = {
    byIds: {},
    filtered: {}
};

/**
 * Create notebook reducer takes care of assigning a new notebook to state
 * @param state NotebooksReduxState the current state
 * @param action CreateNotebookAction The action corresponding to a new notebook
 * @returns state NotebooksReduxState (updated iff the action contains an id)
 */
export function createNotebookReducer(state: NotebooksReduxState, action: CreateNotebookAction) : NotebooksReduxState {
    if (action.payload.id) {
        return {
            ...state,
            byIds: {
                ...state.byIds,
                [action.payload.id]: {
                    data: action.payload as NotebookModel,
                    status: "pending"
                }
            }
        };
    }
    return state;
}

export function notebooksReducer(state: NotebooksReduxState = INITIAL_STATE, action: NotebookActions): NotebooksReduxState {
    switch (action.type) {
        case NOTEBOOK_CREATE_ACTION_TYPE:
            break;
    }
    return state;
};
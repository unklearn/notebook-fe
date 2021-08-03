import { call, put, takeEvery } from "redux-saga/effects";
import { NotebookService, NotebookServiceError } from "../Service";
import { NotebookModel } from "../Types";
import { CreateNotebookAction, createNotebookFailureAction, createNotebookSuccessAction, NOTEBOOK_CREATE_ACTION_TYPE } from "./NotebookActions";

/**
 * Saga that handles the creation of a notebook
 */
export function* createNotebookSaga(action: CreateNotebookAction) {

    try {
        const notebook : NotebookModel = yield call(NotebookService.createNotebook, action.payload);
        yield put(createNotebookSuccessAction(action.payload.hash, notebook));
    } catch (e) {
        if (e instanceof NotebookServiceError) {
            yield put(createNotebookFailureAction(action.payload.hash, e.message));
        } else {
            yield put(createNotebookFailureAction(action.payload.hash, 'An error occurred while creating notebook'));
        }
    }
};

export function* notebookSagaWatcher() {
    yield takeEvery(NOTEBOOK_CREATE_ACTION_TYPE, createNotebookSaga);
}
import { call, put, takeEvery } from "redux-saga/effects";
import { sendWebsocketMessageAction } from "../../connection/WebsocketActions";
import { NotebookService, NotebookServiceError } from "../NotebooksService";
import { CONTAINER_START_EVENT_NAME, NotebookModel } from "../NotebookTypes";
import {
  CreateNotebookAction,
  CreateNotebookContainerAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  GetNotebookByIdAction,
  getNotebookFailureAction,
  getNotebookSuccessAction,
  NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_GET_BY_ID_ACTION_TYPE,
} from "./NotebookActions";

/**
 * Saga that handles the creation of a notebook
 */
export function* createNotebookSaga(action: CreateNotebookAction) {
  try {
    const notebook: NotebookModel = yield call(
      NotebookService.createNotebook,
      action.payload
    );
    yield put(createNotebookSuccessAction(action.payload.hash, notebook));
  } catch (e) {
    if (e instanceof NotebookServiceError) {
      yield put(createNotebookFailureAction(action.payload.hash, e.message));
    } else {
      yield put(
        createNotebookFailureAction(
          action.payload.hash,
          "An error occurred while creating notebook"
        )
      );
    }
  }
}

export function* getNotebookByIdSaga(action: GetNotebookByIdAction) {
  const { notebookId } = action.payload;
  try {
    const notebook: NotebookModel = yield call(
      NotebookService.getNotebookById,
      notebookId
    );
    yield put(getNotebookSuccessAction(notebook));
  } catch (e) {
    if (e instanceof NotebookServiceError) {
      yield put(
        getNotebookFailureAction(notebookId, e.message, e.code === "missing")
      );
    } else {
      yield put(
        getNotebookFailureAction(
          notebookId,
          "An error occurred while fetching notebook",
          false
        )
      );
    }
  }
}

export function* createNotebookContainerSaga(
  action: CreateNotebookContainerAction
) {
  // Fire off a request via notebook channel to create container. Await socket message
  // to update container status to `ready` or `error`.
  const { notebookId, configuration } = action.payload;
  const eventPayload = JSON.stringify({
    image: configuration.image,
    tag: configuration.tag,
    network_options: {
      ports: configuration.ports.split(" "),
    },
    name: configuration.name,
    command: configuration.startCommand.split(" "),
    env: Object.keys(configuration.envVars).map(
      (k) => k + "=" + configuration.envVars[k]
    ),
  });
  yield put(
    sendWebsocketMessageAction(
      notebookId,
      CONTAINER_START_EVENT_NAME,
      eventPayload
    )
  );
}

export function* notebookSagaWatcher() {
  yield takeEvery(NOTEBOOK_CREATE_ACTION_TYPE, createNotebookSaga);
  yield takeEvery(NOTEBOOK_GET_BY_ID_ACTION_TYPE, getNotebookByIdSaga);
  yield takeEvery(
    NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
    createNotebookContainerSaga
  );
}

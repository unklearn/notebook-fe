import cuid from "cuid";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  CONTAINER_COMMAND_EXEC_EVENT_NAME,
  CONTAINER_COMMAND_OUTPUT_EVENT_NAME,
  CONTAINER_START_EVENT_NAME,
  CONTAINER_STATUS_EVENT_NAME,
} from "../../channels/ChannelTypes";
import { WebsocketMessageAction } from "../../connection/Types";
import {
  sendWebsocketMessageAction,
  WEBSOCKET_ON_MESSAGE,
} from "../../connection/WebsocketActions";
import { NotebookService, NotebookServiceError } from "../NotebooksService";
import { ContainerConfiguration, NotebookModel } from "../NotebookTypes";
import {
  CreateNotebookAction,
  CreateNotebookContainerAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  createTerminalCellAction,
  ExecuteCommandInContainerAction,
  GetNotebookByIdAction,
  getNotebookFailureAction,
  getNotebookSuccessAction,
  NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
  NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_GET_BY_ID_ACTION_TYPE,
} from "./NotebookActions";
import { selectContainerByIdFactory } from "./NotebookSelectors";
import { notebookContainerStatusSocketEventAction } from "./NotebookSocketEvents";

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
    hash: action.payload.hash,
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

export function* executeCommandInContainerSaga(
  action: ExecuteCommandInContainerAction
) {
  // Check if the container is running
  const { notebookId, containerId, interactive, useTty, timeout, command } =
    action.payload;
  const container: ContainerConfiguration | undefined = yield select(
    selectContainerByIdFactory(notebookId, containerId)
  );
  if (container && container.status === "running") {
    // Generate cell id
    const cellId = cuid();
    // Create a new cell in the notebook, and set it to listen to the cellId channel
    yield put(
      createTerminalCellAction(notebookId, containerId, cellId, command)
    );
    // Wipe callback registry
    CellSocketCallbackRegistry[cellId] = [];
    yield put(
      sendWebsocketMessageAction(
        containerId,
        CONTAINER_COMMAND_EXEC_EVENT_NAME,
        JSON.stringify({
          cell_id: cellId,
          interactive,
          use_tty: useTty,
          timeout,
          command: command,
        })
      )
    );
  }
}
// A callback registry to call callbacks for
export const CellSocketCallbackRegistry: {
  [cellId: string]: Function[];
} = {};

export function* handleWebsocketMessageSaga(action: WebsocketMessageAction) {
  switch (action.payload.eventName) {
    case CONTAINER_STATUS_EVENT_NAME:
      yield put(notebookContainerStatusSocketEventAction(action));
      break;
    case CONTAINER_COMMAND_OUTPUT_EVENT_NAME:
      // Call stored "fake-socket" and push message
      const callbacks = CellSocketCallbackRegistry[action.payload.channelId];
      if (callbacks) {
        callbacks.forEach((callback) => callback(action.payload.data));
      }
      break;
    default:
      break;
  }
}

export function* notebookSagaWatcher() {
  yield takeEvery(NOTEBOOK_CREATE_ACTION_TYPE, createNotebookSaga);
  yield takeEvery(NOTEBOOK_GET_BY_ID_ACTION_TYPE, getNotebookByIdSaga);
  yield takeEvery(
    NOTEBOOK_CONTAINER_CREATE_ACTION_TYPE,
    createNotebookContainerSaga
  );
  yield takeEvery(
    NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE,
    executeCommandInContainerSaga
  );
  yield takeEvery(WEBSOCKET_ON_MESSAGE, handleWebsocketMessageSaga);
}

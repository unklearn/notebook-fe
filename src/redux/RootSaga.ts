import { all } from "redux-saga/effects";
import { websocketSagaWatcher } from "../modules/connection/WebsocketConnectionSaga";
import { notebookSagaWatcher } from "../modules/notebooks/redux/NotebookSagas";

export function* rootSagaWatcher() {
  yield all([notebookSagaWatcher(), websocketSagaWatcher()]);
}

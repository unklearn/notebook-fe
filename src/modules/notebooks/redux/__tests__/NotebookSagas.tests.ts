import cuid from "cuid";
import { cloneableGenerator } from "@redux-saga/testing-utils";
import { call, put } from "redux-saga/effects";
import {
  CONTAINER_COMMAND_EXEC_EVENT_NAME,
  CONTAINER_START_EVENT_NAME,
} from "../../../channels/ChannelTypes";
import { sendWebsocketMessageAction } from "../../../connection/WebsocketActions";
import { NotebookService, NotebookServiceError } from "../../NotebooksService";
import { NotebookModel } from "../../NotebookTypes";
import {
  createNotebookAction,
  createNotebookContainerAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  createTerminalCellAction,
  executeCommandInContainerAction,
  getNotebookByIdAction,
  getNotebookFailureAction,
  getNotebookSuccessAction,
  updateNotebookAction,
  updateNotebookFailureAction,
  updateNotebookSuccessAction,
} from "../NotebookActions";
import {
  createNotebookContainerSaga,
  createNotebookSaga,
  executeCommandInContainerSaga,
  getNotebookByIdSaga,
  updateNotebookSaga,
} from "../NotebookSagas";
import {
  containerFixture,
  notebookFixture,
} from "../__fixtures__/NotebookTestFixtures";

jest.mock("cuid");

describe("createNotebookSaga", function () {
  test("createNotebookSaga:success", function () {
    const action = createNotebookAction({
      id: "foo",
      name: "Foo",
      description: "Foo desc",
    });
    const gen = createNotebookSaga(action);
    expect(gen.next().value).toEqual(
      call(NotebookService.createNotebook, action.payload)
    );
    // @ts-expect-error
    const notebook: NotebookModel = {
      id: "foo",
      name: "Foo",
      description: "Foo desc",
    };
    expect(gen.next(notebook).value).toEqual(
      put(createNotebookSuccessAction(action.payload.hash, notebook))
    );
    expect(gen.next().done).toEqual(true);
  });

  test("createNotebookSaga:failure", function () {
    const action = createNotebookAction({
      id: "foo",
      name: "Foo",
      description: "Foo desc",
    });
    // @ts-expect-error
    const gen = cloneableGenerator(createNotebookSaga)(action);
    expect(gen.next().value).toEqual(
      call(NotebookService.createNotebook, action.payload)
    );
    const err = { code: "oh-no", message: "Bye-bye" };
    const clone = gen.clone();
    expect(
      // @ts-expect-error
      gen.throw(new NotebookServiceError(err.code, err.message)).value
    ).toEqual(put(createNotebookFailureAction(action.payload.hash, "Bye-bye")));
    expect(gen.next().done).toEqual(true);
    // @ts-expect-error
    expect(clone.throw(new Error("omg")).value).toEqual(
      put(
        createNotebookFailureAction(
          action.payload.hash,
          "An error occurred while creating notebook"
        )
      )
    );
  });
});

describe("updateNotebookSaga", function () {
  test("updateNotebookSaga:success", function () {
    const notebook = {
      ...notebookFixture,
      description: "may day",
    };
    const action = updateNotebookAction(notebook);
    const gen = updateNotebookSaga(action);
    expect(gen.next().value).toEqual(
      call(NotebookService.updateNotebook, action.payload.id, action.payload)
    );
    expect(gen.next(notebook).value).toEqual(
      put(updateNotebookSuccessAction(action.payload.id, notebook))
    );
    expect(gen.next().done).toEqual(true);
  });

  test("updateNotebookSaga:failure", function () {
    const notebook = {
      ...notebookFixture,
      description: "may day",
    };
    const action = updateNotebookAction(notebook);
    // @ts-expect-error
    const gen = cloneableGenerator(updateNotebookSaga)(action);
    expect(gen.next().value).toEqual(
      call(NotebookService.updateNotebook, action.payload.id, action.payload)
    );
    const err = { code: "oh-no", message: "Bye-bye" };
    const clone = gen.clone();
    expect(
      // @ts-expect-error
      gen.throw(new NotebookServiceError(err.code, err.message)).value
    ).toEqual(put(updateNotebookFailureAction(action.payload.id, "Bye-bye")));
    expect(gen.next().done).toEqual(true);
    // @ts-expect-error
    expect(clone.throw(new Error("omg")).value).toEqual(
      put(
        updateNotebookFailureAction(
          action.payload.id,
          "An error occurred while creating notebook"
        )
      )
    );
  });
});

describe("getNotebookByIdSaga", function () {
  test("success", function () {
    const action = getNotebookByIdAction("foo");
    const gen = getNotebookByIdSaga(action);
    expect(gen.next().value).toEqual(
      call(NotebookService.getNotebookById, action.payload.notebookId)
    );
    // @ts-expect-error
    const notebook: NotebookModel = {
      id: "foo",
      name: "Foo",
      description: "Foo desc",
    };
    expect(gen.next(notebook).value).toEqual(
      put(getNotebookSuccessAction(notebook))
    );
    expect(gen.next().done).toEqual(true);
  });

  test("failure", function () {
    const action = getNotebookByIdAction("foo");
    // @ts-expect-error
    const gen = cloneableGenerator(getNotebookByIdSaga)(action);
    expect(gen.next().value).toEqual(
      call(NotebookService.getNotebookById, action.payload.notebookId)
    );
    const err = { code: "oh-no", message: "Bye-bye" };
    const clone = gen.clone();
    expect(
      // @ts-expect-error
      gen.throw(new NotebookServiceError(err.code, err.message)).value
    ).toEqual(
      put(getNotebookFailureAction(action.payload.notebookId, "Bye-bye", false))
    );
    expect(gen.next().done).toEqual(true);
    // @ts-expect-error
    expect(clone.throw(new Error("omg")).value).toEqual(
      put(
        getNotebookFailureAction(
          action.payload.notebookId,
          "An error occurred while fetching notebook",
          false
        )
      )
    );
  });
});

describe("createNotebookContainerSaga", function () {
  test("should send a websocket message with API spec", function () {
    const action = createNotebookContainerAction("foo", {
      name: "django",
      image: "python",
      tag: "3.6",
      envVars: {},
      startCommand: "sleep infinity",
      ports: "8000",
      status: "pending",
      id: "",
    });
    expect(createNotebookContainerSaga(action).next().value).toEqual(
      put(
        sendWebsocketMessageAction(
          "foo",
          CONTAINER_START_EVENT_NAME,
          JSON.stringify({
            image: "python",
            tag: "3.6",
            hash: "eyJub3RlYm9va0lkIjoiZm9vIiwiY29uZmlnIjp7Im5hbWUiOiJkamFuZ28iLCJpbWFnZSI6InB5dGhvbiIsInRhZyI6IjMuNiIsImVudlZhcnMiOnt9LCJzdGFydENvbW1hbmQiOiJzbGVlcCBpbmZpbml0eSIsInBvcnRzIjoiODAwMCIsInN0YXR1cyI6InBlbmRpbmciLCJpZCI6IiJ9fQ==",
            network_options: {
              ports: ["8000"],
            },
            name: "django",
            command: ["sleep", "infinity"],
            env: [],
          })
        )
      )
    );
  });
});

describe("executeCommandInContainerSaga", function () {
  test("does nothing for missing container", function () {
    const action = executeCommandInContainerAction("nid", "cid", ["bash"]);
    const gen = executeCommandInContainerSaga(action);
    // @ts-expect-error Deep comparison of anonymous function does not work
    expect(gen.next().value.type).toEqual("SELECT");
    expect(gen.next(undefined).done).toEqual(true);
  });
  test("does nothing for pending container", function () {
    const action = executeCommandInContainerAction("nid", "cid", ["bash"]);
    const gen = executeCommandInContainerSaga(action);
    // @ts-expect-error Deep comparison of anonymous function does not work
    expect(gen.next().value.type).toEqual("SELECT");
    expect(gen.next({ ...containerFixture, status: "pending" }).done).toEqual(
      true
    );
  });
  test("sends execute command for running container", function () {
    // @ts-expect-error
    cuid.mockReturnValue("cuid-mock");
    const action = executeCommandInContainerAction("nid", "cid", ["bash"]);
    const gen = executeCommandInContainerSaga(action);
    // @ts-expect-error Deep comparison of anonymous function does not work
    expect(gen.next().value.type).toEqual("SELECT");
    expect(gen.next({ ...containerFixture, status: "running" }).value).toEqual(
      put(createTerminalCellAction("nid", "cid", "cuid-mock", ["bash"]))
    );
    expect(gen.next().value).toEqual(
      put(
        sendWebsocketMessageAction(
          "cid",
          CONTAINER_COMMAND_EXEC_EVENT_NAME,
          JSON.stringify({
            cell_id: "cuid-mock",
            interactive: false,
            use_tty: false,
            timeout: -1,
            command: ["bash"],
          })
        )
      )
    );
  });
});

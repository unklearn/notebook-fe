import { NotebookService, NotebookServiceError } from "../../NotebooksService";
import { call, put, takeEvery } from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";
import {
  createNotebookAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  getNotebookByIdAction,
  getNotebookFailureAction,
  getNotebookSuccessAction,
} from "../NotebookActions";
import {
  createNotebookSaga,
  getNotebookByIdSaga,
  notebookSagaWatcher,
} from "../NotebookSagas";
import { NotebookModel } from "../../NotebookTypes";

describe("notebookSagaWatcher", function () {
  test("notebookSagaWatcher:create-notebook", function () {
    const action = createNotebookAction({
      id: "foo",
      name: "Foo",
      description: "Foo desc",
    });
    const gen = notebookSagaWatcher();
    expect(gen.next(action).value).toEqual(
      takeEvery(action.type, createNotebookSaga)
    );
  });
});

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

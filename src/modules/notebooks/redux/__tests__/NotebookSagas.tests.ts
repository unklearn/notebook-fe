import { NotebookService, NotebookServiceError } from "../../NotebooksService";
import { call, put, takeEvery } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { createNotebookAction, createNotebookFailureAction, createNotebookSuccessAction } from "../NotebookActions";
import { createNotebookSaga, notebookSagaWatcher } from "../NotebookSagas";
import { NotebookModel } from "../../NotebookTypes";

test('notebookSagaWatcher:create-notebook', function() {
    const action = createNotebookAction({id: "foo", name:"Foo", description: "Foo desc"});
    const gen = notebookSagaWatcher();
    expect(gen.next(action).value).toEqual(takeEvery(action.type, createNotebookSaga));
});

test('createNotebookSaga:success', function() {
    const action = createNotebookAction({id: "foo", name:"Foo", description: "Foo desc"});
    const gen = createNotebookSaga(action);
    expect(gen.next().value).toEqual(call(NotebookService.createNotebook, action.payload));
    const notebook : NotebookModel = {id:"foo", name: "Foo", description: "Foo desc"};
    expect(gen.next(notebook).value).toEqual(put(createNotebookSuccessAction(action.payload.hash, notebook)));
    expect(gen.next().done).toEqual(true);
});

test('createNotebookSaga:failure', function() {
    const action = createNotebookAction({id: "foo", name:"Foo", description: "Foo desc"});
    // @ts-expect-error
    const gen = cloneableGenerator(createNotebookSaga)(action);
    expect(gen.next().value).toEqual(call(NotebookService.createNotebook, action.payload));
    const err = {code:"oh-no", message:"Bye-bye"};
    const clone = gen.clone();
    expect(
        // @ts-expect-error
        gen.throw(new NotebookServiceError(err.code, err.message)).value
    ).toEqual(put(createNotebookFailureAction(action.payload.hash, "Bye-bye")));
    expect(gen.next().done).toEqual(true);
    if (clone) {
        // @ts-expect-error
        expect(clone.throw(new Error('omg')).value).toEqual(put(createNotebookFailureAction(action.payload.hash, 'An error occurred while creating notebook')));
    }
});
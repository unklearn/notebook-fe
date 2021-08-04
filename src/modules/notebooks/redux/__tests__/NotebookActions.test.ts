import {
  createNotebookAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
  NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
} from "../NotebookActions";

const notebook = {
  id: "foo",
  name: "foo",
  description: "desc",
  containers: [],
  cells: [],
};

test("createNotebookAction", () => {
  expect(createNotebookAction(notebook)).toEqual({
    type: NOTEBOOK_CREATE_ACTION_TYPE,
    payload: {
      ...notebook,
      hash: "eyJpZCI6ImZvbyIsIm5hbWUiOiJmb28iLCJkZXNjcmlwdGlvbiI6ImRlc2MifQ==",
    },
  });
});

test("createNotebookSuccessAction", () => {
  expect(createNotebookSuccessAction("hashy", notebook)).toEqual({
    type: NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
    payload: {
      data: notebook,
      hash: "hashy",
    },
  });
});

test("createNotebookFailureAction", () => {
  expect(createNotebookFailureAction("hashy", "foo")).toEqual({
    type: NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
    payload: {
      hash: "hashy",
      error: "foo",
    },
  });
});

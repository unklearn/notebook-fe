import {
  createNotebookAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  createTerminalCellAction,
  executeCommandInContainerAction,
  NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE,
  NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
  NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
  NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE,
  updateNotebookContainerStatusAction,
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
      hash: "eyJpZCI6ImZvbyIsIm5hbWUiOiJmb28iLCJkZXNjcmlwdGlvbiI6ImRlc2MiLCJjb250YWluZXJzIjpbXSwiY2VsbHMiOltdfQ==",
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

test("executeCommandInContainerAction", function () {
  expect(
    executeCommandInContainerAction("nbid", "containerId", ["bash"])
  ).toEqual({
    type: NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      containerId: "containerId",
      command: ["bash"],
      interactive: false,
      useTty: false,
      timeout: -1,
    },
  });
});

test("updateNotebookContainerStatusAction", function () {
  expect(updateNotebookContainerStatusAction("nid", "cid", "running")).toEqual({
    type: NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
    payload: {
      notebookId: "nid",
      containerId: "cid",
      status: "running",
    },
  });
});

test("createTerminalCellAction", function () {
  expect(createTerminalCellAction("nbid", "cid", "random", ["bash"])).toEqual({
    type: NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      cellId: "random",
      containerId: "cid",
      command: ["bash"],
    },
  });
});

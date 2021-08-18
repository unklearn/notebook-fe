import {
  createFileCellAction,
  createMarkdownCellAction,
  createNotebookAction,
  createNotebookFailureAction,
  createNotebookSuccessAction,
  createTerminalCellAction,
  executeCommandInContainerAction,
  NOTEBOOK_CONTAINER_EXECUTE_COMMAND_ACTION_TYPE,
  NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
  NOTEBOOK_CREATE_ACTION_TYPE,
  NOTEBOOK_CREATE_FAILURE_ACTION_TYPE,
  NOTEBOOK_CREATE_FILE_CELL_ACTION_TYPE,
  NOTEBOOK_CREATE_MARKDOWN_CELL_ACTION_TYPE,
  NOTEBOOK_CREATE_SUCCESS_ACTION_TYPE,
  NOTEBOOK_CREATE_TERMINAL_CELL_ACTION_TYPE,
  NOTEBOOK_SYNC_FILE_CELL_ACTION_TYPE,
  NOTEBOOK_UPDATE_ACTION_TYPE,
  NOTEBOOK_UPDATE_FAILURE_ACTION_TYPE,
  NOTEBOOK_UPDATE_FILE_CELL_ACTION_TYPE,
  NOTEBOOK_UPDATE_MARKDOWN_CELL_ACTION_TYPE,
  NOTEBOOK_UPDATE_SUCCESS_ACTION_TYPE,
  syncFileAction,
  updateFileCellAction,
  updateMarkdownCellAction,
  updateNotebookAction,
  updateNotebookContainerStatusAction,
  updateNotebookFailureAction,
  updateNotebookSuccessAction,
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

test("updateNotebookAction", () => {
  expect(updateNotebookAction(notebook)).toEqual({
    type: NOTEBOOK_UPDATE_ACTION_TYPE,
    payload: notebook,
  });
});

test("updateNotebookSuccessAction", () => {
  expect(updateNotebookSuccessAction(notebook.id, notebook)).toEqual({
    type: NOTEBOOK_UPDATE_SUCCESS_ACTION_TYPE,
    payload: notebook,
  });
});

test("updateNotebookFailureAction", () => {
  expect(updateNotebookFailureAction("id", "foo")).toEqual({
    type: NOTEBOOK_UPDATE_FAILURE_ACTION_TYPE,
    payload: {
      id: "id",
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

test("createMarkdownCellAction", function () {
  expect(createMarkdownCellAction("nbid", "cid", "###Heading3")).toEqual({
    type: NOTEBOOK_CREATE_MARKDOWN_CELL_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      cellId: "cid",
      content: "###Heading3",
    },
  });
});

test("updateMarkdownCellAction", function () {
  expect(updateMarkdownCellAction("nbid", "cid", "###Hello")).toEqual({
    type: NOTEBOOK_UPDATE_MARKDOWN_CELL_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      cellId: "cid",
      content: "###Hello",
    },
  });
});

test("syncFileAction", function () {
  expect(syncFileAction("nbid", "cid", "cellId", "/var/fb/1")).toEqual({
    type: NOTEBOOK_SYNC_FILE_CELL_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      cellId: "cellId",
      containerId: "cid",
      filePath: "/var/fb/1",
    },
  });
});

test("createFileCellAction", function () {
  expect(
    createFileCellAction("nbid", "cid", "/var/fb/1", "", "cellId")
  ).toEqual({
    type: NOTEBOOK_CREATE_FILE_CELL_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      cellId: "cellId",
      containerId: "cid",
      content: "",
      filePath: "/var/fb/1",
    },
  });
});

test("updateFileCellAction", function () {
  expect(updateFileCellAction("nbid", "cid", "cellId", "/var/fb/1")).toEqual({
    type: NOTEBOOK_UPDATE_FILE_CELL_ACTION_TYPE,
    payload: {
      notebookId: "nbid",
      cellId: "cellId",
      containerId: "cid",
      filePath: "/var/fb/1",
    },
  });
});

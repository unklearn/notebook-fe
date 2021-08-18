import {
  createFileCellAction,
  createMarkdownCellAction,
  createNotebookAction,
  createNotebookContainerAction,
  createTerminalCellAction,
  getNotebookSuccessAction,
  updateMarkdownCellAction,
  updateNotebookContainerStatusAction,
  updateNotebookSuccessAction,
} from "../NotebookActions";
import { notebooksReducer, NotebooksReduxState } from "../NotebooksReducer";
import {
  containerFixture,
  notebookFixture,
  terminalCellFixture,
} from "../__fixtures__/NotebookTestFixtures";

describe("notebooksReducer", function () {
  test("createNotebook", function () {
    const action = createNotebookAction(notebookFixture);
    expect(notebooksReducer(undefined, action)).toEqual({
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            hash: "eyJpZCI6ImZvbyIsIm5hbWUiOiJGb28iLCJjZWxscyI6W10sImNvbnRhaW5lcnMiOltdfQ==",
          },
          status: "pending",
        },
      },
      filtered: {},
    });
  });
  test("updateNotebookReducer", function () {
    const action = updateNotebookSuccessAction(
      notebookFixture.id,
      notebookFixture
    );
    expect(notebooksReducer(undefined, action)).toEqual({
      byIds: {
        [notebookFixture.id]: {
          data: notebookFixture,
          status: "done",
        },
      },
      filtered: {},
    });
  });
  test("addNotebook", function () {
    const action = getNotebookSuccessAction(notebookFixture);
    expect(notebooksReducer(undefined, action)).toEqual({
      byIds: {
        [notebookFixture.id]: {
          data: notebookFixture,
          status: "done",
        },
      },
      filtered: {},
    });
  });

  test("addConditionalContainer", function () {
    const action = createNotebookContainerAction(
      notebookFixture.id,
      containerFixture
    );
    const state: NotebooksReduxState = {
      byIds: {
        [notebookFixture.id]: {
          data: notebookFixture,
          status: "done",
        },
      },
      filtered: {},
    };
    expect(
      notebooksReducer(
        state,
        createNotebookContainerAction("non-existent", containerFixture)
      )
    ).toEqual(state);
    expect(notebooksReducer(state, action)).toEqual({
      ...state,
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            containers: [
              {
                ...containerFixture,
                status: "pending",
                hash: "eyJub3RlYm9va0lkIjoiZm9vIiwiY29uZmlnIjp7ImlkIjoieHh5eSIsImltYWdlIjoicHl0aG9uIiwidGFnIjoiMy42Iiwic3RhcnRDb21tYW5kIjoiIiwicG9ydHMiOiIiLCJlbnZWYXJzIjp7fSwibmFtZSI6ImRqYW5nbyIsInN0YXR1cyI6InBlbmRpbmcifX0=",
              },
            ],
          },
          status: "done",
        },
      },
    });
  });

  test("addTerminalCellReducer", function () {
    const state: NotebooksReduxState = {
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [],
          },
          status: "done",
        },
      },
      filtered: {},
    };
    const action = createTerminalCellAction(
      notebookFixture.id,
      containerFixture.id,
      "cuid",
      ["bash"]
    );
    expect(notebooksReducer(state, action)).toEqual({
      ...state,
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [
              {
                containerId: containerFixture.id,
                type: "terminal",
                id: "cuid",
                command: ["bash"],
              },
            ],
          },
          status: "done",
        },
      },
    });
  });

  test("addMarkdownCellReducer", function () {
    const state: NotebooksReduxState = {
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [],
          },
          status: "done",
        },
      },
      filtered: {},
    };
    const action = createMarkdownCellAction(
      notebookFixture.id,
      "cuid",
      "Hello"
    );
    expect(notebooksReducer(state, action)).toEqual({
      ...state,
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [
              {
                type: "markdown",
                id: "cuid",
                content: "Hello",
              },
            ],
          },
          status: "done",
        },
      },
    });
  });

  test("updateMarkdownCellReducer", function () {
    const state: NotebooksReduxState = {
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [
              {
                id: "cuid",
                content: "###Hello",
                type: "markdown",
              },
            ],
          },
          status: "done",
        },
      },
      filtered: {},
    };
    const action = updateMarkdownCellAction(
      notebookFixture.id,
      "cuid",
      "###Hello World"
    );
    expect(notebooksReducer(state, action)).toEqual({
      ...state,
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [
              {
                type: "markdown",
                id: "cuid",
                content: "###Hello World",
              },
            ],
          },
          status: "done",
        },
      },
    });
  });

  test("addFileCellReducer", function () {
    const state: NotebooksReduxState = {
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [],
          },
          status: "done",
        },
      },
      filtered: {},
    };
    const action = createFileCellAction(
      notebookFixture.id,
      "cuid",
      "/var/fb/1",
      "Hello world",
      "coolaid"
    );
    expect(notebooksReducer(state, action)).toEqual({
      ...state,
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            cells: [
              {
                type: "file",
                id: "coolaid",
                filePath: "/var/fb/1",
                containerId: "cuid",
                content: "Hello world",
              },
            ],
          },
          status: "done",
        },
      },
    });
  });

  test("updateContainerStatus", function () {
    const state: NotebooksReduxState = {
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            containers: [containerFixture],
          },
          status: "done",
        },
      },
      filtered: {},
    };
    const action = updateNotebookContainerStatusAction(
      notebookFixture.id,
      containerFixture.id,
      "running"
    );
    expect(notebooksReducer(state, action)).toEqual({
      ...state,
      byIds: {
        [notebookFixture.id]: {
          data: {
            ...notebookFixture,
            containers: [
              {
                ...containerFixture,
                status: "running",
              },
            ],
          },
          status: "done",
        },
      },
    });
  });
});

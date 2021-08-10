import {
  createNotebookAction,
  createNotebookContainerAction,
  getNotebookSuccessAction,
  updateNotebookContainerStatusAction,
} from "../NotebookActions";
import { notebooksReducer, NotebooksReduxState } from "../NotebooksReducer";
import {
  containerFixture,
  notebookFixture,
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
            containers: [{ ...containerFixture, status: "pending" }],
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

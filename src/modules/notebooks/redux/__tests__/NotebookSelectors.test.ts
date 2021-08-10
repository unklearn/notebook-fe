import { RootState } from "../../../../redux/Store";
import { selectNotebookByIdFactory } from "../NotebookSelectors";
import { notebookFixture } from "../__fixtures__/NotebookTestFixtures";

describe("selectNotebookbyIdFactory", function () {
  test("done and data is present", function () {
    const state: RootState = {
      notebooks: {
        byIds: {
          abc: {
            data: notebookFixture,
            status: "done",
          },
        },
        filtered: {},
      },
      channels: {},
    };
    expect(selectNotebookByIdFactory("abc")(state).data).toEqual(
      notebookFixture
    );
  });

  test("missing", function () {
    const state: RootState = {
      notebooks: {
        byIds: {
          abc: {
            data: notebookFixture,
            status: "done",
          },
        },
        filtered: {},
      },
      channels: {},
    };
    expect(selectNotebookByIdFactory("def")(state)).toEqual({
      data: undefined,
      status: "missing",
    });
  });
});

describe("selectContainerByIdFactory", function () {});

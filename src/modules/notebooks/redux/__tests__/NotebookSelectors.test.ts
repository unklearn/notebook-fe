import { RootState } from "../../../../redux/Store";
import {
  selectContainerByIdFactory,
  selectNotebookByIdFactory,
} from "../NotebookSelectors";
import {
  containerFixture,
  notebookFixture,
} from "../__fixtures__/NotebookTestFixtures";

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

describe("selectContainerByIdFactory", function () {
  test("missing notebook", function () {
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
    expect(selectContainerByIdFactory("def", "abc")(state)).toEqual(undefined);
  });

  test("missing container", function () {
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
    expect(selectContainerByIdFactory("abc", "def")(state)).toEqual(undefined);
  });

  test("data present", function () {
    const state: RootState = {
      notebooks: {
        byIds: {
          abc: {
            data: {
              ...notebookFixture,
              containers: [containerFixture],
            },
            status: "done",
          },
        },
        filtered: {},
      },
      channels: {},
    };
    expect(
      selectContainerByIdFactory("abc", containerFixture.id)(state)
    ).toEqual(containerFixture);
  });
});

import {
  ContainerConfiguration,
  NotebookModel,
  TerminalCell,
} from "../../NotebookTypes";

export const notebookFixture: NotebookModel = {
  id: "foo",
  name: "Foo",
  cells: [],
  containers: [],
};

export const containerFixture: ContainerConfiguration = {
  id: "xxyy",
  image: "python",
  tag: "3.6",
  startCommand: "",
  ports: "",
  envVars: {},
  name: "django",
  status: "pending",
};

export const terminalCellFixture: TerminalCell = {
  id: "term-cell",
  type: "terminal",
  command: ["bash"],
  containerId: "cid",
};

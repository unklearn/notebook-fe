import { ContainerConfiguration, NotebookModel } from "../../NotebookTypes";

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

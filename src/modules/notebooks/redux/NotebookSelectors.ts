import { RootState } from "../../../redux/Store";

/**
 * Factory function that returns a selector function that selects notebook by id
 * @param notebookId Id of notebook
 * @returns a selector function
 */
export function selectNotebookByIdFactory(notebookId: string) {
  return (state: RootState) =>
    state.notebooks.byIds[notebookId] || { status: "missing" };
}

/**
 * Factory function that returns a selector function that selects a container in
 * a notebook
 * @param notebookId
 * @param containerId
 * @returns
 */
export function selectContainerByIdFactory(
  notebookId: string,
  containerId: string
) {
  return (state: RootState) => {
    const notebook = state.notebooks.byIds[notebookId];
    if (notebook && notebook.status === "done") {
      return notebook.data.containers.find((c) => c.id === containerId);
    }
  };
}

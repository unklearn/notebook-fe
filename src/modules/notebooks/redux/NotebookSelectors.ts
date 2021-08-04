import { RootState } from "../../../redux/Store";

/**
 * Factory function that returns a selector function that selects notebook by id
 * @param notebookId Id of notebook
 * @returns a selector function
 */
export function selectNotebookByIdFactory(notebookId: string) {
  return (state: RootState) => state.notebooks.byIds[notebookId];
}

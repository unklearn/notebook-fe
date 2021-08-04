export interface NotebookModel {
    id: string;
    name: string;
    description?: string;
};

/**
 * Used to communicate between the backend and frontend
 */
export interface CommChannel {
    id: string;
};
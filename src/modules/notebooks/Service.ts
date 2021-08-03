import { fetch } from "../../utils/Fetch";
import { CreateNotebookAction } from "./redux/NotebookActions";
import { NotebookModel } from "./Types";

export class NotebookServiceError extends Error {
    public code: string;
    public message: string;
    constructor(code:string, message:string) {
        super();
        this.message = message;
        this.code = code;
    }
}
/**
 * Service layer for notebooks
 */
export class NotebookService {
    /**
     * Create a new notebook
     * @param payload The payload for creating a new notebook
     * @returns The created notebook if successful
     * @throws NotebookServiceError if operation fails
     */
    static async createNotebook(payload: CreateNotebookAction['payload']) :Promise<NotebookModel> {
        const response : Response = await fetch('/api/v1/notebooks', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const body = await response.json();
        if (response.status === 201) {
            return body as NotebookModel;
        } else {
            throw new NotebookServiceError(body.code, body.message);
        }
    }
};
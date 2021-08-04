export interface NotebookModel {
  id: string;
  name: string;
  description?: string;
  // Store container configs
  containers: ContainerConfiguration[];
  // cells
  cells: INotebookCell[];
}

export interface INotebookCell {
  // A unique short id for the cell
  id: string;
  // The index of the cell in cells array
  index: number;
  // A getter for cell type
  getType(): string;
}

export class MarkdownCell implements INotebookCell {
  id: string;
  index: number;
  type = "markdown";
  content: string;
  constructor(id: string, index: number, content: string) {
    this.id = id;
    this.index = index;
    this.content = content || "";
  }

  getType() {
    return this.type;
  }
}

export interface ContainerConfiguration {
  id?: string;
  // Container name
  name: string;
  // Docker image
  image: string;
  // Docker tag
  tag: string;
  // Environment variables to apply on the container
  envVars: Record<string, string>;
  // Container start command
  startCommand: string;
  // List of exposed ports separated by whitespace
  ports: string;
  // The state of the runtime
  status: "pending" | "starting" | "started" | "stopped";
}

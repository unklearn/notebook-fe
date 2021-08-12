export interface NotebookModel {
  id: string;
  name: string;
  description?: string;
  // Store container configs
  containers: ContainerConfiguration[];
  // cells
  cells: NotebookCell[];
}

export interface TerminalCell {
  id: string;
  type: "terminal";
  command: string[];
  containerId: string;
}

export interface MarkdownCell {
  id: string;
  type: "markdown";
  content: string;
}

export type NotebookCell = TerminalCell | MarkdownCell;

export interface ContainerConfiguration {
  id: string;
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
  status: "pending" | "running" | "stopped";
  // Optional hash used to store a config signature
  hash?: string;
}

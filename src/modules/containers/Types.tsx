export interface ContainerConfiguration {
    id: string;
    // Container name
    name: string
    // Docker image
    image: string,
    // Docker tag
    tag: string,
    // Environment variables to apply on the container
    envVars: Record<string,string>,
    // Container start command
    startCommand: string,
    // List of exposed ports separated by whitespace
    ports: string,
    // The state of the runtime
    status: "pending" | "starting" | "started" | "stopped"
};
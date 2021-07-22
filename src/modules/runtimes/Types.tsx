export interface RuntimeConfiguration {
    // Docker image
    image: string,
    // Docker tag
    tag: string,
    // Environment variables to apply on the container
    envVars: Record<string,string>
    // The state of the runtime
    status: "pending" | "starting" | "started" | "stopped"
};
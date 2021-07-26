import React, { useState } from "react";
import { ContainerConfiguration } from "../Types";
import './ContainerConfigurationsPanel.css';

export interface ContainerConfigurationsPanelProps {
    configurations?: ContainerConfiguration[],
    onCreateNew: (config: ContainerConfiguration) => void;
    handleFileAdd: (containerId: string) => void;
    handleDocAdd: () => void;
    handleCommandRun: (containerId: string, cmd: string) => void;
};

export interface NewContainerConfigurationProps {
    onSave: (config: ContainerConfiguration) => void;
    onCancel: () => void;
}

export interface ContainerConfigurationDetailsProps {
    config: ContainerConfiguration,
    onFileAdd: () => void;
    onDocAdd: () => void;
    onCommandRun: (cmd: string) => void;
}

const ContainerConfigurationDetails: React.FC<ContainerConfigurationDetailsProps> = ({ config, onFileAdd, onDocAdd, onCommandRun }) => {
    const commandExecInputId = config.name + "-command-exec";
    return (
        <div className="unk-container-configuration-details box">
            <h5 className="subtitle is-5">{config.name}</h5>
            <div className="field">
                <label className="label">
                    Image
                </label>
                <p>{config.image}</p>
            </div>
            <div className="field">
                <label className="label">
                    Tag
                </label>
                <p>{config.tag}</p>
            </div>
            <div className="field">
                <label className="label">
                    Execute command
                </label>
                <div className="control">
                    <input id={commandExecInputId} className="input" type="text" placeholder="Enter command to run" />
                </div>
                <button className="button is-small is-info" onClick={handleCommandRun}>
                    Run
                </button>
            </div>
            <div className="field">
                <label className="label">
                    Actions
                </label>
                <button className="button is-small is-primary" onClick={handleFileAdd}>
                    Add file viewer
                </button>
                <button className="button is-small is-warning" onClick={onDocAdd}>
                    Add documentation
                </button>
            </div>

        </div>
    );

    function handleFileAdd() {
        onFileAdd();
    }

    function handleCommandRun() {
        const inp = document.getElementById(commandExecInputId);
        if (inp) {
            let value = (inp as HTMLInputElement).value;
            onCommandRun(value);
        }
    }
};

const NewContainerConfiguration: React.FC<NewContainerConfigurationProps> = ({
    onSave,
    onCancel
}) => {
    const [config, setConfig] = useState<ContainerConfiguration>({
        id: "",
        name: "",
        image: "",
        tag: "latest",
        envVars: {},
        ports: "",
        startCommand: 'sleep infinity',
        status: "pending"
    });
    const [env, setEnv] = useState<{ key: string, value: string }[]>([]);
    return (
        <div className="unk-container-configuration-details box">
            <h5 className="subtitle is-5">Enter new container configuration</h5>
            <form onSubmit={_handleSubmit}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input className="input" type="text" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} placeholder="Enter container name" />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Image</label>
                    <div className="control">
                        <input className="input" type="text" value={config.image} onChange={(e) => setConfig({ ...config, image: e.target.value })} placeholder="Enter container image" />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Tag</label>
                    <div className="control">
                        <input className="input" type="text" value={config.tag} onChange={(e) => setConfig({ ...config, tag: e.target.value })} placeholder="Enter container image tag" />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Start command</label>
                    <div className="control">
                        <input className="input" type="text" value={config.startCommand} onChange={(e) => setConfig({ ...config, startCommand: e.target.value })} placeholder="Enter container start command" />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Ports</label>
                    <div className="control">
                        <input className="input" type="text" value={config.ports} onChange={(e) => setConfig({ ...config, ports: e.target.value })} placeholder="Enter ports to be exposed separated by whitespace" />
                    </div>
                </div>


                <div className="field">
                    <label className="label">Environment variables</label>

                    <div className="control">
                        <table className="table is-fullwidth is-striped">
                            <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {env.map((entry: { key: string, value: string }, i: number) => {
                                    return (
                                        <tr key={i}>
                                            <td><input type="text" value={entry.key} onChange={(e) => {
                                                _modifyEnvVar("key", i, e.target.value);
                                            }} required className="input" /></td>
                                            <td><input type="text" onChange={(e) => {
                                                _modifyEnvVar("value", i, e.target.value);
                                            }} value={entry.value} className="input" /></td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td><button type="button" onClick={_addEnvVar} className="button is-small is-ghost">Add</button></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button onSubmit={_handleSubmit} className="button is-link">Save</button>
                    </div>
                    <div className="control">
                        <button type="button" onClick={_handleCancel} className="button is-link is-light">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
    function _modifyEnvVar(t: "key" | "value", index: number, value: string) {
        env[index][t] = value;
        setEnv(env.slice());
    }

    function _handleCancel(e: any) {
        e.preventDefault();
        onCancel();
        return false;
    }

    function _handleSubmit(e: any) {
        e.preventDefault();
        // Validate data is necessary
        let envVars: Record<string, string> = {};
        env.forEach((e) => envVars[e.key] = e.value);
        onSave({
            ...config,
            envVars: envVars
        })
        return false;
    }

    function _addEnvVar() {
        const keyLen = Object.keys(config.envVars).length;
        config.envVars["key-" + keyLen] = "";
        setEnv([...env, { key: "key-" + keyLen, value: "" }])
    }
};

export const ContainerConfigurationsPanel: React.FC<ContainerConfigurationsPanelProps> = ({
    configurations = [],
    onCreateNew,
    handleFileAdd,
    handleDocAdd,
    handleCommandRun
}) => {
    const [active, setActive] = useState("");
    const [addNew, setAddNew] = useState(false);
    const activeConfig = configurations.find((c) => c.name === active);
    return <section className="section unk-container-configurations-panel">
        <div className="message">
            <div className="message-header">
                <p>Containers</p>
            </div>
            <div className="message-body">
                List of active containers for this notebook. To add a new container, click the "Add" button
            </div>
        </div>
        <div className="block">

        </div>
        <div className="tabs is-small is-toggle">
            <ul>
                {configurations.map((c) => <li key={c.name} className={active === c.name ? "is-active" : undefined} onClick={() => active === c.name ? setActive('') : setActive(c.name)}>
                    <a>{c.name}</a>
                </li>)}
                <li>
                    <button className="button is-ghost is-small" onClick={() => setAddNew(true)}>Add</button>
                </li>
            </ul>
        </div>
        {activeConfig && !addNew && <ContainerConfigurationDetails config={activeConfig} onFileAdd={() => {
            handleFileAdd(activeConfig.id);
        }} onCommandRun={(cmd) => {
            handleCommandRun(activeConfig.id, cmd);
        }} onDocAdd={handleDocAdd}/>}
        {addNew && <NewContainerConfiguration onSave={(config) => {
            setAddNew(false);
            onCreateNew(config);
        }} onCancel={() => setAddNew(false)} />}
    </section>
};
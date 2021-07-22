import React, { useState } from "react";
import { ContainerConfiguration } from "../Types";
import './ContainerConfigurationsPanel.css';

export interface ContainerConfigurationsPanelProps {
    configurations?: ContainerConfiguration[]
};

export interface NewContainerConfigurationProps {
    onSave: (config: ContainerConfiguration) => void;
    onCancel: () => void;
}

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
        status: "pending"
    });
    const [env, setEnv] = useState<{key: string, value: string}[]>([]);
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
                                {env.map((entry: {key: string, value: string}, i: number) => {
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
    function _modifyEnvVar(t: "key" | "value", index : number, value: string) {
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
        let envVars : Record<string, string> = {};
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
        setEnv([...env, {key: "key-" + keyLen, value:  ""}])
    }
};

export const ContainerConfigurationsPanel: React.FC<ContainerConfigurationsPanelProps> = ({
    configurations = []
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
                {configurations.map((c) => <li key={c.name} className={active === c.name ? "is-active" : undefined} onClick={() => setActive(c.name)}>
                    <a>{c.name}</a>
                </li>)}
                <li>
                    <button className="button is-ghost is-small" onClick={() => setAddNew(true)}>Add</button>
                </li>
            </ul>
        </div>

        {addNew && <NewContainerConfiguration onSave={console.log} onCancel={() => setAddNew(false)}/>}
    </section>
};
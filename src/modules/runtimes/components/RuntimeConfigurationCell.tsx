import React, { useState } from "react";
import { CodeEditor } from "../../cells/components/CodeEditor";
import { RuntimeConfiguration } from "../Types";

export interface RuntimeConfigurationCellProps {
    configuration?: RuntimeConfiguration
};

export const RuntimeConfigurationCell : React.FC<RuntimeConfigurationCellProps> = ({
    configuration = {}
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return <div className="unk-cell unk-cell--runtime-configuration">
        <button onClick={() => setIsEditing(!isEditing)}>
            Edit
        </button>
        <div className="panel is-info">
            {isEditing ? (
                <div className="field panel-heading">
                    <label className="label">Name</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Image name"/>
                    </div>
                </div>
            ) : <p className="panel-heading">
                {configuration.image}
            </p>}
        </div>
    </div>
};
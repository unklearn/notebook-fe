import React from "react";
import { RuntimeConfigurationCell } from "../../runtimes/components/RuntimeConfigurationCell";
import { RuntimeConfiguration } from "../../runtimes/Types";


export interface NotebookProps {
    // id of the notebook
    id: string;
    // name of the notebook
    name: string;
    // Runtime configs
    runtimeConfigurations: RuntimeConfiguration[];
}

export const Notebook : React.FC<NotebookProps> = ({
    id,
    name,
    runtimeConfigurations
}) => {
    // Runtime configurations 
    return (
        <div className="unk-notebook">
            {/* Runtime configurations go first */}
            <RuntimeConfigurationCell/>
        </div>
    );
};
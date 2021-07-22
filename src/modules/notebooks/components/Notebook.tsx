import React from "react";
import { ContainerConfigurationsPanel } from "../../containers/components/ContainerConfigurationsPanel";
import { ContainerConfiguration } from "../../containers/Types";


export interface NotebookProps {
    // id of the notebook
    id: string;
    // name of the notebook
    name: string;
    // Container configs
    containerConfigurations: ContainerConfiguration[];
}

export const Notebook : React.FC<NotebookProps> = ({
    id,
    name,
    containerConfigurations
}) => {
    // Runtime configurations 
    return (
        <div className="unk-notebook">
            {/* Runtime configurations go first */}
            <ContainerConfigurationsPanel configurations={containerConfigurations}/>
        </div>
    );
};
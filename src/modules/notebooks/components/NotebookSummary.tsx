import React from "react";
import { ContainerConfigurationPanelContainer } from "../containers/ContainerConfigurationPanelContainer";
import { NotebookModel } from "../NotebookTypes";
import "./NotebookSummary.css";

export interface NotebookSummaryProps {
  notebook: NotebookModel;
}

export const NotebookSummary: React.FC<NotebookSummaryProps> = ({
  notebook,
}) => {
  return (
    <div className="unk-notebook-summary">
      <ContainerConfigurationPanelContainer notebookId={notebook.id} />
    </div>
  );
};

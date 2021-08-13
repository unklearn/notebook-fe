import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../../redux/Store";
import { ContainerConfigurationsPanel } from "../components/ContainerConfigurationsPanel";
import { ContainerConfiguration } from "../NotebookTypes";
import {
  createFileCellAction,
  createNotebookContainerAction,
  executeCommandInContainerAction,
  syncFileAction,
} from "../redux/NotebookActions";
import { selectNotebookByIdFactory } from "../redux/NotebookSelectors";

export interface ContainerConfigurationPanelContainerProps {
  notebookId: string;
}

function mapStateToProps(
  state: RootState,
  ownProps: ContainerConfigurationPanelContainerProps
) {
  const { data, status } = selectNotebookByIdFactory(ownProps.notebookId)(
    state
  );
  return {
    configurations: data.containers && status === "done" ? data.containers : [],
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: ContainerConfigurationPanelContainerProps
) {
  return {
    onCreateNew: (config: ContainerConfiguration) =>
      dispatch(createNotebookContainerAction(ownProps.notebookId, config)),
    handleFileAdd: (containerId: string) =>
      dispatch(createFileCellAction(ownProps.notebookId, containerId)),
    handleDocAdd: console.log,
    handleCommandRun: (containerId: string, cmd: string) =>
      dispatch(
        executeCommandInContainerAction(
          ownProps.notebookId,
          containerId,
          cmd.split(" "),
          { interactive: true, useTty: true }
        )
      ),
  };
}
export const ContainerConfigurationPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerConfigurationsPanel);

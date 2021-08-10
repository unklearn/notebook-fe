import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../../redux/Store";
import { ContainerConfiguration } from "../NotebookTypes";
import { selectNotebookByIdFactory } from "../redux/NotebookSelectors";
import { ContainerConfigurationsPanel } from "../components/ContainerConfigurationsPanel";
import { createNotebookContainerAction } from "../redux/NotebookActions";
import { sendWebsocketMessageAction } from "../../connection/WebsocketActions";
import { CONTAINER_COMMAND_EXEC_EVENT_NAME } from "../../channels/ChannelTypes";

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
    handleFileAdd: console.log,
    handleDocAdd: console.log,
    handleCommandRun: (containerId: string, cmd: string) =>
      dispatch(
        sendWebsocketMessageAction(
          containerId,
          CONTAINER_COMMAND_EXEC_EVENT_NAME,
          JSON.stringify(cmd.split(" "))
        )
      ),
  };
}
export const ContainerConfigurationPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerConfigurationsPanel);

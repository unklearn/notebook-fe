import React from "react";
import { ContainerConfigurationsPanel } from "./ContainerConfigurationsPanel";
import { NotebookModel } from "../NotebookTypes";
import { ContainerConfigurationPanelContainer } from "../containers/ContainerConfigurationPanelContainer";

export interface NotebookProps {
  // id of the notebook
  notebook: NotebookModel;
}

export class Notebook extends React.Component<NotebookProps> {
  constructor(props: NotebookProps) {
    super(props);
    // this.state = {
    //     configs: props.containerConfigurations || [],
    //     channelMap: {},
    //     cells: []
    // };
    // if (this.props.socket) {
    //     const rootCh = this.setupRootChannel(props.socket);
    //     if (rootCh) {
    //         this.state.channelMap.root = rootCh;
    //     }
    // }
  }

  // setupRootChannel(socket?: WebSocketMultiplex) {
  //     if (socket) {
  //         const rootCh = socket.channel(this.props.id);
  //         this.addRootChannelHandlers(rootCh);
  //         return rootCh;
  //     }
  // }

  // componentDidUpdate(prevProps: NotebookProps) {
  //     if (prevProps.socket !== this.props.socket) {
  //         const rootCh = this.setupRootChannel(this.props.socket)
  //         if (rootCh) {
  //             this.setState({
  //                 channelMap: {
  //                     [this.props.id]: rootCh
  //                 }
  //             })
  //         }
  //     }
  // }

  render() {
    const { notebook } = this.props;
    return (
      <div className="unk-notebook">
        <div className="box">
          <section className="hero is-primary">
            <div className="hero-body">
              <p className="title">{notebook.name}</p>
              <p className="subtitle">{notebook.description}</p>
            </div>
          </section>
          {/* Runtime configurations go first */}

          <ContainerConfigurationPanelContainer notebookId={notebook.id} />

          <section className="section">{notebook.cells}</section>
        </div>
      </div>
    );
  }

  // handleDocAdd = () => {
  //     this.setState({
  //         cells: this.state.cells.concat([<MarkdownCell key={this.state.cells.length} />])
  //     })
  // };

  // handleNewContainer = (config: ContainerConfiguration) => {
  //     // Add it to containerConfigurations
  //     this.setState({
  //         configs: this.state.configs.concat([config])
  //     })
  //     // Advertise via root socket
  //     const rootChannel = this.state.channelMap[this.props.id];
  //     if (rootChannel) {

  // }

  // addRootChannelHandlers = (root: MxedChannel) => {
  //     root.addEventListener('message', (payload: { type: string, data: ArrayBuffer }) => {
  //         const { channelMap, configs, cells } = this.state;
  //         const { socket } = this.props;
  //         switch (payload.type) {
  //             case "container:status":
  //                 // Add a new channel
  //                 // Parse data
  //                 const decoded = new TextDecoder().decode(payload.data);
  //                 const parsed = JSON.parse(decoded);
  //                 const ch = (socket as WebSocketMultiplex).channel(parsed.id);
  //                 channelMap[parsed.id] = ch;
  //                 // Less than ideal, but we can use this for now:
  //                 const lastConfig = configs[configs.length - 1];
  //                 lastConfig.id = parsed.id;
  //                 console.log(decoded, parsed)
  //                 this.setState({
  //                     configs,
  //                     channelMap
  //                 })
  //                 break;
  //             case 'terminal-started':
  //                 // Add a new channel
  //                 // const commandCh = (socket as WebSocketMultiplex).channel(payload.data);
  //                 // channelMap[payload.data] = commandCh;
  //                 // this.setState({
  //                 //     channelMap,
  //                 //     cells: cells.concat([<TerminalCell key={payload.data} channelId={payload.data} socket={commandCh} />])
  //                 // })
  //                 // add a new xterm and publish to channel
  //                 break;
  //             case 'file-contents':
  //                 // Use last cell, and pass prop

  //                 const newCells = cells.map((c, i) => {
  //                     if (i === cells.length - 1) {
  //                         return React.cloneElement(c, {
  //                             ...c.props,
  //                             key: i,
  //                             fileContents: payload.data
  //                         });
  //                     }
  //                     return c;
  //                 });
  //                 this.setState({
  //                     cells: newCells
  //                 })
  //                 break;
  //             default:
  //                 console.warn('Unknown type', payload.type);
  //                 break;
  //         }
  //     });
  // }

  // handleCommandRun = (containerId: string, cmd: string) => {
  //     const ch = this.state.channelMap[containerId];
  //     if (ch) {
  //         ch.send("execute:command", JSON.stringify({
  //             Action: "exec-terminal",
  //             Command: cmd.split(' ')
  //         }))
  //     }
  // }

  // addFileCell = (containerId: string) => {
  //     const { cells } = this.state;
  //     this.setState({
  //         cells: cells.concat([<FileCell key={cells.length} containerId={containerId} filePath="" onContentChange={this.syncFile} onPathChange={this.syncFile} />])
  //     })
  // }

  // /**
  //  * Add a cell that syncs to a file on the container
  //  * @param containerId The id of the container
  //  * @param fileName The name of the file including path
  //  * @param fileContents The contents of the file. If syncing, server will populate this
  //  * value
  //  */
  // syncFile = (containerId: string, fileName: string, fileContents?: string) => {
  //     const { channelMap } = this.state;
  //     const ch = channelMap[containerId];
  //     if (ch) {
  //         ch.send("file:sync", JSON.stringify({
  //             Action: "sync-file",
  //             Path: fileName,
  //             Contents: fileContents
  //         }));
  //     }
  // }
}

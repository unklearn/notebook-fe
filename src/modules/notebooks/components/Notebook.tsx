import cuid from "cuid";
import React from "react";
import { store } from "../../../redux/Store";
import { FileCell } from "../../cells/components/FileCell";
import { MarkdownCell } from "../../cells/components/MarkdownCell";
import { TerminalCellComponent } from "../../cells/components/TerminalCell";
import { NotebookCell, NotebookModel } from "../NotebookTypes";
import { createMarkdownCellAction } from "../redux/NotebookActions";
import { NotebookSummary } from "./NotebookSummary";

export interface NotebookProps {
  // id of the notebook
  notebook: NotebookModel;
}

export class Notebook extends React.Component<NotebookProps> {
  constructor(props: NotebookProps) {
    super(props);
  }

  render() {
    const { notebook } = this.props;
    return (
      <div className="unk-notebook">
        <div>
          <section>
            <NotebookSummary notebook={notebook} />
          </section>
          <section>
            <p className="title">{notebook.name}</p>
            <p className="subtitle">{notebook.description}</p>
          </section>
          {/* Runtime configurations go first */}

          <button
            className="button is-small is-warning"
            onClick={this.handleDocAdd}
          >
            Add documentation
          </button>
          <section className="section">
            {notebook.cells.map((c) => this.renderCells(c))}
          </section>
        </div>
      </div>
    );
  }

  renderCells(cell: NotebookCell) {
    if (cell.type === "terminal") {
      return <TerminalCellComponent key={cell.id} {...cell} />;
    } else if (cell.type === "markdown") {
      return <MarkdownCell key={cell.id} content={cell.content} />;
    } else if (cell.type === "file") {
      return (
        <FileCell
          key={cell.id}
          notebookId={this.props.notebook.id}
          containerId={cell.containerId}
          cellId={cell.id}
          content={cell.content}
          filePath={cell.filePath}
        />
      );
    }
  }

  handleDocAdd = () => {
    const cellId = cuid();
    store.dispatch(
      createMarkdownCellAction(this.props.notebook.id, cellId, "")
    );
  };

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

import React from "react";
import { FileCell } from "../../cells/components/FileCell";
import { MarkdownCell } from "../../cells/components/MarkdownCell";
import { TerminalCell } from "../../cells/components/TerminalCell";
import { MxedChannel, WebSocketMultiplex } from "../../connection/WebsocketMultiplex";
import { ContainerConfigurationsPanel } from "../../containers/components/ContainerConfigurationsPanel";
import { ContainerConfiguration } from "../../containers/Types";


export interface NotebookProps {
    // id of the notebook
    id: string;
    // name of the notebook
    name: string;
    // Container configs
    containerConfigurations: ContainerConfiguration[];
    // Socket connection
    socket?: WebSocketMultiplex
}

interface NotebookState {
    configs: ContainerConfiguration[],
    channelMap: Record<string, MxedChannel>
    cells: React.ReactElement[]
};

export class Notebook extends React.Component<NotebookProps, NotebookState> {
    constructor(props: NotebookProps) {
        super(props);
        this.state = {
            configs: props.containerConfigurations || [],
            channelMap: {},
            cells: []
        };
        if (this.props.socket) {
            const rootCh = this.setupRootChannel(props.socket);
            if (rootCh) {
                this.state.channelMap.root = rootCh;
            }
        }
    }


    setupRootChannel(socket?: WebSocketMultiplex) {
        if (socket) {
            const rootCh = socket.channel('root');
            this.addRootChannelHandlers(rootCh);
            return rootCh;
        }
    }

    componentDidUpdate(prevProps: NotebookProps) {
        if (prevProps.socket !== this.props.socket) {
            const rootCh = this.setupRootChannel(this.props.socket)
            if (rootCh) {
                this.setState({
                    channelMap: {
                        'root': rootCh
                    }
                })
            }
        }
    }

    render() {
        const {
            configs,
            cells
        } = this.state;
        return (
            <div className="unk-notebook">

                <div className="box">
                    <section className="hero is-primary">
                        <div className="hero-body">
                            <p className="title">
                                Interactive Django tutorial
                            </p>
                            <p className="subtitle">
                                Step by step guide to setting up your first django project
                            </p>
                        </div>
                    </section>
                    {/* Runtime configurations go first */}


                    <ContainerConfigurationsPanel configurations={configs} handleFileAdd={this.addFileCell} handleDocAdd={this.handleDocAdd} onCreateNew={this.handleNewContainer} handleCommandRun={this.handleCommandRun} />

                    <section className="section">
                        {cells}
                    </section>
                </div>

            </div>
        );
    }

    handleDocAdd = () => {
        this.setState({
            cells: this.state.cells.concat([<MarkdownCell key={this.state.cells.length} />])
        })
    };

    handleNewContainer = (config: ContainerConfiguration) => {
        // Add it to containerConfigurations
        this.setState({
            configs: this.state.configs.concat([config])
        })
        // Advertise via root socket
        const rootChannel = this.state.channelMap['root'];
        if (rootChannel) {
            rootChannel.send(JSON.stringify({
                Image: config.image,
                Tag: config.tag,
                Action: "start",
                Ports: config.ports.split(' '),
                Command: config.startCommand.split(' '),
                Env: Object.keys(config.envVars).map((k) => k + '=' + config.envVars[k])
            }))
        }
    }

    addRootChannelHandlers = (root: MxedChannel) => {
        root.addEventListener('message', (payload: { type: string, data: string }) => {
            const { channelMap, configs, cells } = this.state;
            const { socket } = this.props;
            switch (payload.type) {
                case "container-started":
                    // Add a new channel
                    const ch = (socket as WebSocketMultiplex).channel(payload.data);
                    channelMap[payload.data] = ch;
                    // Less than ideal, but we can use this for now:
                    const lastConfig = configs[configs.length - 1];
                    lastConfig.id = payload.data;
                    this.setState({
                        configs,
                        channelMap
                    })
                    break;
                case 'terminal-started':
                    // Add a new channel
                    const commandCh = (socket as WebSocketMultiplex).channel(payload.data);
                    channelMap[payload.data] = commandCh;
                    this.setState({
                        channelMap,
                        cells: cells.concat([<TerminalCell key={payload.data} channelId={payload.data} socket={commandCh} />])
                    })
                    // add a new xterm and publish to channel
                    break;
                case 'file-contents':
                    // Use last cell, and pass prop

                    const newCells = cells.map((c, i) => {
                        if (i === cells.length - 1) {
                            return React.cloneElement(c, {
                                ...c.props,
                                key: i,
                                fileContents: payload.data
                            });
                        }
                        return c;
                    });
                    this.setState({
                        cells: newCells
                    })
                    break;
                default:
                    console.warn('Unknown type', payload.type);
                    break;
            }
        });
    }

    handleCommandRun = (containerId: string, cmd: string) => {
        const ch = this.state.channelMap[containerId];
        if (ch) {
            ch.send(JSON.stringify({
                Action: "exec-terminal",
                Command: cmd.split(' ')
            }))
        }
    }

    addFileCell = (containerId: string) => {
        const { cells } = this.state;
        this.setState({
            cells: cells.concat([<FileCell key={cells.length} containerId={containerId} filePath="" onContentChange={this.syncFile} onPathChange={this.syncFile} />])
        })
    }

    /**
     * Add a cell that syncs to a file on the container
     * @param containerId The id of the container
     * @param fileName The name of the file including path
     * @param fileContents The contents of the file. If syncing, server will populate this
     * value
     */
    syncFile = (containerId: string, fileName: string, fileContents?: string) => {
        const { channelMap } = this.state;
        const ch = channelMap[containerId];
        if (ch) {
            ch.send(JSON.stringify({
                Action: "sync-file",
                Path: fileName,
                Contents: fileContents
            }));
        }
    }
};
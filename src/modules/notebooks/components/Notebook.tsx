import React, { useEffect, useState } from "react";
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

export const Notebook : React.FC<NotebookProps> = ({
    id,
    name,
    socket,
    containerConfigurations
}) => {
    // Runtime configurations
    const [configs, setConfigs] = useState<ContainerConfiguration[]>(containerConfigurations);
    const [channelMap, setChannelMap] = useState<Record<string, MxedChannel>>({});
    const [cells, setCells] = useState<React.ReactNode[]>([]);
    useEffect(() => {
        if (socket) {
            const rootCh = socket.channel('root');
            setChannelMap({'root': rootCh});
            addRootChannelHandlers(rootCh);
        }
    }, [socket]);
    return (
        <div className="unk-notebook">
            {/* Runtime configurations go first */}
            <ContainerConfigurationsPanel configurations={configs} onCreateNew={handleNewContainer} handleCommandRun={handleCommandRun}/>
            <section className="section">
                {cells}
            </section>
        </div>
    );

    function handleNewContainer(config: ContainerConfiguration) {
        // Add it to containerConfigurations
        configs.push(config);
        setConfigs(configs);
        // Advertise via root socket
        const rootChannel = channelMap['root'];
        if (rootChannel) {
            rootChannel.send(JSON.stringify({
                Image: config.image,
                Tag: config.tag,
                Action: "start"
            }))
        }
    }
 
    function addRootChannelHandlers(root: MxedChannel) {
        root.addEventListener('message', (payload: {type: string, data: string}) => {
            switch (payload.type) {
                case "container-started":
                    // Add a new channel
                    const ch = (socket as WebSocketMultiplex).channel(payload.data);
                    channelMap[payload.data] = ch;
                    // Less than ideal, but we can use this for now:
                    const lastConfig = configs[configs.length - 1];
                    lastConfig.id = payload.data;
                    setConfigs(configs);
                    setChannelMap(channelMap);
                    break;
                case 'command-started':
                    // Add a new channel
                    const commandCh = (socket as WebSocketMultiplex).channel(payload.data);
                    channelMap[payload.data] = commandCh;
                    setChannelMap(channelMap);
                    setCells(cells.concat([<TerminalCell key={payload.data} channelId={payload.data} socket={commandCh}/>]));
                    // add a new xterm and publish to channel
                    break;
                default:
                    console.warn('Unknown type', payload.type);
                    break;
            }
        });
    }

    function handleCommandRun(containerId: string, cmd: string) {
        const ch = channelMap[containerId];
        if (ch) {
            ch.send(JSON.stringify({
                Action: "exec-command",
                Command: [cmd]
            }))
        }
    }
};
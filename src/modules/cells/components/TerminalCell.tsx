import { useEffect } from 'react';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { MxedChannel } from '../../connection/WebsocketMultiplex';

export interface TerminalCellProps {
    channelId: string,
    socket: MxedChannel
};

export const TerminalCell : React.FC<TerminalCellProps> = ({
    channelId,
    socket
}) => {
    useEffect(() => {
        setTimeout(() => {
            const terminal = new Terminal({convertEol: true});
        // @ts-expect-error
        const addon = new AttachAddon(socket, {bidirectional: true});
        terminal.loadAddon(addon);
        // @ts-expect-error
        terminal.open(document.getElementById(channelId));
        }, 500);
    }, [socket]);
    return (
        <div id={channelId} style={{
            width: "100%"
        }}>

        </div>
    );
};
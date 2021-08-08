import { useEffect } from "react";
import { ITheme, Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";

export interface TerminalCellProps {
  channelId: string;
}

/*
    Terminal theme
    https://github.com/xtermjs/xterm.js/blob/3.0.2/typings/xterm.d.ts#L95
*/

const MonokaiTheme: ITheme = {
  background: "#212121",
  foreground: "#F8F8F2",
  cursor: "#F8F8F0",
  selection: "#49483E",
};

export const TerminalCell: React.FC<TerminalCellProps> = ({ channelId }) => {
  // useEffect(() => {
  //     setTimeout(() => {
  //         const terminal = new Terminal({convertEol: true});
  //         terminal.setOption('theme', MonokaiTheme);
  //     // @ts-expect-error
  //     const addon = new AttachAddon(socket, {bidirectional: true});
  //     terminal.loadAddon(addon);
  //     // @ts-expect-error
  //     terminal.open(document.getElementById(channelId));
  //     }, 500);
  // }, [socket, channelId]);
  return (
    <div className="box">
      <div
        id={channelId}
        style={{
          width: "100%",
        }}
      ></div>
    </div>
  );
};

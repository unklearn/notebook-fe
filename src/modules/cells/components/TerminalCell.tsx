import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ITheme, Terminal } from "xterm";
import { CONTAINER_COMMAND_INPUT_EVENT_NAME } from "../../channels/ChannelTypes";
import { sendWebsocketMessageAction } from "../../connection/WebsocketActions";
import { TerminalCell } from "../../notebooks/NotebookTypes";
import { CellSocketCallbackRegistry } from "../../notebooks/redux/NotebookSagas";
import { TerminalSocketAddon } from "../TerminalSocketAddon";

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

export const TerminalCellComponent: React.FC<TerminalCell> = ({ id }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const terminal = new Terminal({ convertEol: true });
    terminal.setOption("theme", MonokaiTheme);
    const addon = new TerminalSocketAddon(
      CellSocketCallbackRegistry,
      id,
      sendTerminalData
    );
    terminal.loadAddon(addon);
    // @ts-expect-error
    terminal.open(document.getElementById(id));
    return () => {
      terminal.dispose();
    };
  }, [id]);

  function sendTerminalData(id: string, data: string | ArrayBufferLike) {
    dispatch(
      sendWebsocketMessageAction(id, CONTAINER_COMMAND_INPUT_EVENT_NAME, data)
    );
  }
  return (
    <div className="box">
      <div
        id={id}
        style={{
          width: "100%",
        }}
      ></div>
    </div>
  );
};

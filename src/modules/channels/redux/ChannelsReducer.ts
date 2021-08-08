import { WebsocketMessageAction } from "../../connection/Types";
import { WEBSOCKET_ON_MESSAGE } from "../../connection/WebsocketActions";
import { ChannelActionTypes, NotebookChannelReduxState } from "../ChannelTypes";

const INITIAL_STATE: NotebookChannelReduxState = {};

function handleChannelMessageReducer(
  state: NotebookChannelReduxState,
  action: WebsocketMessageAction
): NotebookChannelReduxState {
  // Add it to logs for channel.
  const { channelId, eventName, data } = action.payload;
  if (!state[channelId]) {
    // Do not handle unknown channels
    return state;
  }
  let { offset = 0, logs = [] } = (state[channelId] || {}).eventMap[eventName];
  logs = [...logs, data];
  offset = offset + 1;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      eventMap: {
        ...(state[channelId].eventMap || {}),
        [eventName]: {
          logs,
          offset,
        },
      },
    },
  };
}

/**
 * Root channel reducer
 * @param state The reducer for channel notebooks
 * @param action The actions corresponding to channel types
 */
export function channelsReducer(
  state: NotebookChannelReduxState = INITIAL_STATE,
  action: ChannelActionTypes
): NotebookChannelReduxState {
  switch (action.type) {
    case WEBSOCKET_ON_MESSAGE:
      return handleChannelMessageReducer(state, action);
    default:
      return state;
  }
}

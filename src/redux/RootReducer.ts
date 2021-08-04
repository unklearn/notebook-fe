import { channelsReducer } from "../modules/channels/redux/ChannelsReducer";
import { notebooksReducer } from "../modules/notebooks/redux/NotebooksReducer";

export const rootReducer = {
    notebooks: notebooksReducer,
    channels: channelsReducer
};
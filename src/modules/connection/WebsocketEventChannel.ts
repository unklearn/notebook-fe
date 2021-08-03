import { eventChannel, END } from 'redux-saga';
import { MxedChannel } from './WebsocketMultiplex';

/**
 * Create a new websocket channel for listening to events
 *
 * The event channel takes care of emitting events received from websocket
 * namespace into saga's channel. This allows a root websocket saga to
 * take items from channel and dispatch actions that will be handled by
 * other sagas.
 * 
 * @param  {MxedChannel} socket The multiplexed channel
 */
export default function createSocketEventChannel(socket: MxedChannel, decoder: ) {
  return eventChannel(emit => {
    
    socket.addEventListener('message', (e : MessageEvent<Blob>) => {
        const data = e.data;
        emit({
          type: eventType,
          payload
        });
      });

    socket.addEventListener('disconnect', () => {
      emit(END);
    });

    const unsubscribe = () => {
      socket.close();
    };

    return unsubscribe;
  });
}
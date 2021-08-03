import { combineReducers, createStore } from 'redux';
import { rootReducer } from './RootReducer';

export const store = createStore(combineReducers(rootReducer));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
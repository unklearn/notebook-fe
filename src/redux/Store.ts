import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./RootReducer";
import { rootSagaWatcher } from "./RootSaga";
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  combineReducers(rootReducer),
  composeEnhancers(applyMiddleware(...[sagaMiddleware]))
);

sagaMiddleware.run(rootSagaWatcher);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  return {
	...createStore(rootReducer, applyMiddleware(sagaMiddleware)),
    runSagas: sagaMiddleware.run
  }
}
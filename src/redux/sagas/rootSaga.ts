import { all } from 'redux-saga/effects';
import cyclesSagas from './cyclesSagas';

export default function* rootSaga() {
  yield all([
    cyclesSagas()
  ]);
}


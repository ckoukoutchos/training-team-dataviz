import { all } from 'redux-saga/effects';
import cyclesSagas from './cyclesSagas';

export default function* rootSage() {
  yield all([
    cyclesSagas()
  ]);
}


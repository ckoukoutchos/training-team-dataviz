import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './redux/store';
import rootSaga from './redux/sagas/rootSaga'
import './index.css';
import App from './App';

const store = configureStore();

store.runSagas(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

/* #######################################################################
#  Disclaimer:                                                            #
#  Most of this app was built as a fever dream, stream of consciousness   #
#  venture in the wee hours of the morning while suffering from insomnia. #
#  If you find something that doesn't makes sense or makes you think      #
#  why in God's name would anyone do this, it's probably because it       #
#  doesn't and no one in their right mind would.                          #
#########################################################################*/
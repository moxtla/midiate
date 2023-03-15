import React from 'react';
import './index.css';

import { Provider } from 'react-redux'
import store from './redux/store'

import Client from './ui/client';


import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Provider store={store}>
  <Client />
</Provider>);


// const rootElement = document.getElementById('root')
// ReactDOM.render(
//     <Provider store={store}>
//       <Client />
//     </Provider>,
//     rootElement
// )

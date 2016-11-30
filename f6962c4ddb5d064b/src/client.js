import React from 'react';
import ReactDOM from 'react-dom';
import app from './App';

const App = React.createFactory(app);

ReactDOM.render(App(window.APP_PROPS), document.getElementById('content'))
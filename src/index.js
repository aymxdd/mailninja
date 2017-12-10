import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Main from './comp/Main';

ReactDOM.render(<Main/>, document.getElementById('root'));
registerServiceWorker();

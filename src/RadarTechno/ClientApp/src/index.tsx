import 'whatwg-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './layout/App/';
import * as serviceWorker from './serviceWorker';

import '@axa-fr/react-toolkit-all/dist/style/bootstrap/grid.css';
import '@axa-fr/react-toolkit-all/dist/style/bootstrap/reboot.css';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();

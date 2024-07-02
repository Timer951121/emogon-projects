import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import MainComponent from './components/Main';
import registerServiceWorker from './registerServiceWorker';

import './assets/css/index.css';

render(
	<BrowserRouter>
		<MainComponent></MainComponent>
	</BrowserRouter>
	, document.getElementById('root'));

registerServiceWorker();

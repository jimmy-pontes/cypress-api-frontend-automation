import './commands';

const config = require('./config');
Cypress.config('frontendBaseUrl', config.frontendBaseUrl);
Cypress.config('apiBaseUrl', config.apiBaseUrl);

import 'cypress-plugin-api';

import * as selectors from '../mappings/selectors/selectors';
import * as routes from '../mappings/routes/routes';

globalThis.selectors = selectors;
globalThis.routes = routes;

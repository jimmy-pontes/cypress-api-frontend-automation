
import './commands'

const config = require('./config');
Cypress.config('frontendBaseUrl', config.frontendBaseUrl);
Cypress.config('apiBaseUrl', config.apiBaseUrl);

global.users = require('./users');

import 'cypress-plugin-api'

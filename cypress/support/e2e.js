
import './commands'

const config = require('./config');
Cypress.config('frontendBaseUrl', config.frontendBaseUrl);
Cypress.config('apiBaseUrl', config.apiBaseUrl);

global.users = require('./users');

import 'cypress-plugin-api'

import * as selectors from '../mappings/selectors/selectors.js'
import * as routes from '../mappings/routes/routes.js'

globalThis.selectors = selectors
globalThis.routes = routes

import { faker } from '@faker-js/faker';
Cypress.faker = faker;

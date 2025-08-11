const { defineConfig } = require("cypress");
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const envName = process.env.ENV || 'dev';

      config.env.ENV = envName;

      return config;
    }
  }
});

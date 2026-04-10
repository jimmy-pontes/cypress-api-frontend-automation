const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/json",
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      const envName = process.env.ENV || 'dev';

      config.env.ENV = envName;

      return config;
    }
  }
});

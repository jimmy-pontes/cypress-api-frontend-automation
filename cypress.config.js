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
    supportFile: 'cypress/support/e2e.ts',
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      const envName = process.env.ENV || 'dev';

      config.env.ENV = envName;

      return config;
    }
  }
});

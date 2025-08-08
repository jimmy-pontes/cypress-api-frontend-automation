const { defineConfig } = require("cypress");
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const envName = process.env.ENV || 'dev';
      const envFilePath = `.env.${envName}`;

      if (fs.existsSync(envFilePath)) {
        const envVars = dotenv.parse(fs.readFileSync(envFilePath));
        for (const key in envVars) {
          config.env[key] = envVars[key];
        }
      } else {
        throw new Error(`Arquivo ${envFilePath} não encontrado.`);
      }

      config.env.ENV = envName;

      return config;
    }
  }
});

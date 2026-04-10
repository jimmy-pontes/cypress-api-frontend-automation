const config = {
    dev: {
      frontendBaseUrl: "https://front.serverest.dev",
      apiBaseUrl: "https://serverest.dev"
    },
    staging: {
      frontendBaseUrl: "",
      apiBaseUrl: ""
    },
    prod: {
      frontendBaseUrl: "",  
      apiBaseUrl: ""            
    }
  };

  const env = Cypress.env('ENV') || 'dev';
  module.exports = config[env];
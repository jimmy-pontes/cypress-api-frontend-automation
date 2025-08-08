const users = {
    user: {
      email: Cypress.env('USER_EMAIL'),
      password: Cypress.env('USER_PASS')
    },
    admin: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASS')
      }
  };
  module.exports = users;
/// <reference types="Cypress" />
context('Basic: Login/Logout Handling', () => {
  describe('User Login/Logout Tests', () => {
    beforeEach(function () {
      const user = 'admin';
      const pass = '1234';
      const url = Cypress.config().baseUrl+'/login';
      cy.login(user, pass, url);
      cy.contains('3.6.5 final').should('be.visible');
    })
    it('logs in user', () => {
      cy.get('button#logoutButton').should('be.visible');
    })

    it('logs out user', () => {
      cy.logout();
      cy.get('input#inputUsername').should('be.visible');
      cy.get('button#loginButton').should('be.visible');
    })
  });
});

/// <reference types="Cypress" />
context('Actions', () => {
  describe('Basic: User Login Test', () => {
    beforeEach(function () {
      const user = 'admin';
      const pass = '1234';
      const url = Cypress.config().baseUrl+'/login';
      cy.login(user, pass, url);
    })
    it('logs in user', () => {
      cy.get('button#logoutButton').should('be.visible');
    })

    it('logs out user', () => {
      cy.logout();
      cy.get('button#loginButton').should('be.visible');
    })
  });
});

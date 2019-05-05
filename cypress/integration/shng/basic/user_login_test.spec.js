/// <reference types="Cypress" />
context('Actions', () => {
  describe('Basic: User Login Test', () => {
    beforeAll(function () {
      const user = 'admin';
      const pass = '1234';
      const url = 'http://localhost:4200/'
    })
    it('logs in user', () => {
      cy.login(user, pass, url);
      cy.get('button#logoutButton').should('be.visible');
    })

    it('logs out user', () => {
      cy.login(user, pass, url);
      cy.logout();
      cy.get('button#loginButton').should('be.visible');
    })
  });
});

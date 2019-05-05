/// <reference types="Cypress" />
context('Actions', () => {
  describe('Basic: User Login Test', () => {
    it('logs in user', () => {
      const user = 'admin'
      const pass = '1234';
      cy.login(user, pass);
      cy.get('button#logoutButton').should('be.visible');
    })

    it('logs out user', () => {
      const user = 'admin'
      const pass = '1234';
      cy.login(user, pass);
      cy.logout();
      cy.get('button#loginButton').should('be.visible');
    })
  });
});

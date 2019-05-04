/// <reference types="Cypress" />
context('Actions', () => {
  describe('Basic: User Login Test', () => {
    it('logs in user', () => {
      const user = 'admin'
      const pass = '1234';
      cy.login(user, pass);
      cy.get('#logoutButton').should('be.visible');
    })
  });
});

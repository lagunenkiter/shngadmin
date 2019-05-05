/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    const user = 'admin'
    const pass = '1234';
    const url = 'http://localhost:4200/';
    cy.login(user, pass, url);
  })
  describe('Basic: Navigate to logics parameters', () => {
    it('navigates to logics parameters', () => {
      cy.contains('Logiken').should('be.visible').click();
      cy.contains('wind.py').should('be.visible').click();
      cy.contains('Parameter').should('be.visible').click();
    })
  })
});

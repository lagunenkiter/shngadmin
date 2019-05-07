/// <reference types="Cypress" />

context('Logics: New Logics Tests', () => {
  beforeEach(() => {
    const user = 'admin'
    const pass = '1234';
    const url = Cypress.config().baseUrl+'/logics/';
    cy.login(user, pass, url);
    cy.contains('test.py').should('be.visible');
  })
  afterEach(() => {
    cy.logout();
  })
  describe('Add Valid New Logics Tests', () => {
    it('creates a new logic', () => {
      cy.get('button#newLogicButton').should('be.visible').click();
      cy.get('input#nlog').should('be.visible').type('TestLogic');
      cy.get('input#nfn').should('be.visible').type('TestFile');
      cy.get('button#cancleCreateLogicsButton').should('not.be.disabled');
      cy.get('button#createLogicsButton').should('not.be.disabled').click();
    })
  })
});

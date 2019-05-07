/// <reference types="Cypress" />

context('Logics: Logic handling tests', () => {
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
  describe('Add/Remove Watch Item Tests', () => {
    it('creates a new logic', () => {
      cy.get('button#newLogicButton').should('be.visible').click();
      cy.get('input#nlog').should('be.visible'.type('Testlogik'));
      cy.get('input#nfn').should('be.visible').type('Testfile');
      cy.get('button#cancleCreateLogicsButton');
      cy.get('button#createLogicsButton');
    })
  })
});

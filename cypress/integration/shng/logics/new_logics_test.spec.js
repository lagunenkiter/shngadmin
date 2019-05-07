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
  describe('Add New Logics Tests', () => {
    it('tries to create an existing filename - and corrects it', () => {
      cy.get('button#newLogicButton').should('be.visible').click();
      cy.get('input#nlog').should('be.visible').type('TestLogicExistingFilename');
      cy.get('input#nfn').should('be.visible').type('test');
      cy.get('button#cancleCreateLogicsButton').should('not.be.disabled');
      cy.get('button#createLogicsButton').should('be.disabled');
      cy.get('#newLogicsAlert div').should('be.visible');
      cy.get('input#nfn').should('be.visible').type('test');
      cy.get('button#cancleCreateLogicsButton').should('not.be.disabled');
      cy.get('button#createLogicsButton').should('not.be.disabled');
    })
    it('tries to create an existing logic name - and corrects it', () => {
      cy.get('button#newLogicButton').should('be.visible').click();
      cy.get('input#nlog').should('be.visible').type('test');
      cy.get('input#nfn').should('be.visible').type('TestLogicExistingLogicName');
      cy.get('button#cancleCreateLogicsButton').should('not.be.disabled');
      cy.get('button#createLogicsButton').should('be.disabled');
      cy.get('#newLogicsAlert div').should('be.visible');
      cy.get('input#nlog').should('be.visible').type('test');
      cy.get('button#cancleCreateLogicsButton').should('not.be.disabled');
      cy.get('button#createLogicsButton').should('not.be.disabled');
    })
    it('creates a new valid logic', () => {
      cy.get('button#newLogicButton').should('be.visible').click();
      cy.get('input#nlog').should('be.visible').type('TestLogic');
      cy.get('input#nfn').should('be.visible').type('TestFile');
      cy.get('button#cancleCreateLogicsButton').should('not.be.disabled');
      cy.get('button#createLogicsButton').should('not.be.disabled').click();
    })
  })
});

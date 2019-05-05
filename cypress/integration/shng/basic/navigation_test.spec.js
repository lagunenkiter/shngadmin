/// <reference types="Cypress" />

context('Basic: Navigation Tests', () => {
  beforeEach(() => {
    const user = 'admin'
    const pass = '1234';
    const url = Cypress.config().baseUrl;
    cy.login(user, pass, url);
    cy.contains('Systemeigenschaften').should('be.visible');
    cy.contains('3.6.5 final').should('be.visible');
  })
  afterEach(() => {
    cy.logout();
  })
  describe('Navigate to Logics Parameters', () => {
    it('navigates to logics parameters', () => {
      cy.get('a[href$="/logics"]').should('be.visible').click();
      cy.get('a#userlogics_wind\\.py').should('be.visible').click();
      cy.contains('Parameter').should('be.visible').click();
      cy.get('button#knx\\.weather\\.wind').should('be.visible');
      cy.contains('WindLogic').should('be.visible');
    })
  })
  describe('Navigate to Logs', () => {
    it('navigates to log overview page', () => {
      cy.wait(3000);
      cy.get('a[href$="/logs"]').should('be.visible').click();
      cy.wait(3000);
      cy.get('button#reloadLogButton').should('be.visible');
      cy.contains('2019-03-17  08:42:23 ERROR').should('exist');
    })
  })
});

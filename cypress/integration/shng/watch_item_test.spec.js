/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    const user = 'admin'
    const pass = '1234';
    cy.login(user, pass);
  })
  describe('Logics: Watch Item Test', () => {
    it('navigates to logics parameters and enters watch item', () => {
      cy.wait(1000);
      cy.contains('Logiken').click();
      cy.wait(1000);
      cy.contains('wind.py').click();
      cy.wait(1000);
      cy.contains('Parameter').click();
      cy.wait(1000);
      cy.addWatchItem('sh.avm');
      cy.removeWatchItem('sh.avm');

      cy.addWatchItem('sh.sh.avm');
      cy.removeWatchItem('sh.avm');

      cy.addWatchItem('avm');
      cy.removeWatchItem('avm');
    })
  })
});

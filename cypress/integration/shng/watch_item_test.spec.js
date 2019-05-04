/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    const user = 'admin'
    const pass = '1234';
    cy.login(user, pass);
    cy.navigateLogics();
  })
  describe('Logics: Add Watch Item Test', () => {
    it('navigates to logics parameters and enters/removes watch item', () => {
      cy.addWatchItem('sh.avm');
      cy.removeWatchItem('sh.avm');

      cy.addWatchItem('sh.sh.avm');
      cy.removeWatchItem('sh.avm');

      cy.addWatchItem('avm');
      cy.removeWatchItem('avm');
    })

    it('navigates to logics parameters and enters watch item twice', () => {
      cy.addWatchItem('avm');
      cy.addWatchItem('avm');
      cy.contains('Item ungültig oder bereits in der Liste vorhanden, bitte Eingabe prüfen!');
    })
  })
});

/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    const user = 'admin'
    const pass = '1234';
    const url = 'http://localhost:4200/logics/edit/test%7Ctest.py';
    cy.login(user, pass, url);
    cy.contains('Parameter').should('be.visible').click();

  })
  describe('Logics: Add Watch Item Test', () => {
    it('navigates to logics parameters and enters/removes valid watch item', () => {
      cy.addWatchItem('sh.avm');
      cy.get('button#sh\\.avm').should('be.visible');
      cy.removeWatchItem('sh.avm');

      cy.addWatchItem('sh.sh.avm');
      cy.get('button#sh\\.avm').should('be.visible');
      cy.removeWatchItem('sh.avm');

      cy.addWatchItem('avm');
      cy.get('button#avm').should('be.visible');
      cy.removeWatchItem('avm');
    })

    it('navigates to logics parameters and enters invalid watch item', () => {
      cy.addWatchItem('asdfasfasf');
      cy.contains('Item ungültig oder bereits in der Liste vorhanden, bitte Eingabe prüfen!');
      cy.get('button#asdfasfasf').should('not.exist');
    })

    it('navigates to logics parameters and enters watch item sh.avm twice', () => {
      // in this case an item with sh.avm and avm exist. as sh.avm is entered first, on the second entry the sh. prefix
      // gets parsed away and item avm is added
      cy.addWatchItem('sh.avm');
      cy.addWatchItem('sh.avm');
      cy.get('button#sh\\.avm').should('be.visible');
      cy.get('button#avm').should('be.visible');
    })

    it('navigates to logics parameters and enters watch item twice', () => {
      // items with same name cannot be entered twice, an error message appears
      cy.addWatchItem('avm');
      cy.addWatchItem('avm');
      cy.contains('Item ungültig oder bereits in der Liste vorhanden, bitte Eingabe prüfen!');
      cy.get('button#avm').should('have.length', 1);
    })
  })
});

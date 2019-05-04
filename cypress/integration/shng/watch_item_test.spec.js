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
      var cm = cy.get('.CodeMirror textarea').eq(1);
      cm.type('sh.avm', { force: true });
      cy.contains('Item hinzufügen').click();
      cy.contains('avm');
    });
  });
})
